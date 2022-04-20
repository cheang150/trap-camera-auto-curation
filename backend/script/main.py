import datetime
import sys

import cv2
import os.path
import shutil
import numpy as np
from moviepy.editor import VideoFileClip
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
import Background.ImageHash as ImageHash
import Background.CheckBlurness as CheckBlurness
import Background.Enhancement as Enhancement

from Mega.detection.run_tf_detector import load_and_run_detector,ImagePathUtils

DEFAULT_RENDERING_CONFIDENCE_THRESHOLD = 0.19
MEGA_MODEL_FILE_PATH = r"script/Mega/detection/md_v4.1.0.pb"
countOriginal = 1
countSharpen = 1
countFinal = 1

def timeChangeToSecond(string):
    array = string.split(":")
    minutes = array[0]
    seconds = int(array[1],base = 10)
    seconds += int(minutes,base = 10) * 60
    return seconds

video_file = sys.argv[1]
start_time_string = sys.argv[2]
end_time_string = sys.argv[3]
superResponse = int(sys.argv[4],base=10)
histResponse = int(sys.argv[5],base=10)
autoResponse = int(sys.argv[6],base=10)

start_time = timeChangeToSecond(start_time_string)
end_time = timeChangeToSecond(end_time_string)

x = video_file.split("/")

path = r"results/Background/" + x[-1]  # Folder to store results
output = r"results/Mega/" + x[-1]

path = os.path.abspath(path)
if os.path.isdir(path):
    shutil.rmtree(path)
    os.mkdir(path)
else:
    os.mkdir(path)

output = os.path.abspath(output)
if os.path.isdir(output):
    shutil.rmtree(output)
    os.mkdir(output)
else:
    os.mkdir(output)

removed = r"script/Background/Removed"
removed = os.path.abspath(removed)
if os.path.isdir(removed):
    shutil.rmtree(removed)
    os.mkdir(removed)
else:
    os.mkdir(removed)

if(superResponse <= 0):
    superResponse = 1

if(autoResponse <= 0):
    autoResponse = 1

if(start_time < 0):
    start_time = 0

if(histResponse < 0):
    histResponse = 0

# Video information
def get_sec(time_str):
    h, m, s = time_str.split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)

modified_video = video_file + "_modified.mp4"
video_time = str(datetime.timedelta(seconds=VideoFileClip(video_file).duration))
video_seconds = get_sec(video_time)
if start_time >= 0 and 0 < end_time <= video_seconds:
    ffmpeg_extract_subclip(video_file, start_time, end_time, targetname=modified_video)
else:
    end_time = video_seconds
    ffmpeg_extract_subclip(video_file, start_time, end_time, targetname=modified_video)

# Super resolution pre-trained model response
superCounter = 1
if superResponse == 1:
    superCounter = 1
elif superResponse == 2:
    superCounter = 2
elif superResponse == 3:
    superCounter = 3
else:
    # print("[-] Invalid input for super resolution model" + '\n')
    exit()

# Histogram Equalizer response
histCounter = 0
if histResponse == 1:
    histCounter = 1
elif histResponse == 0:
    histCounter = 0
else:
    # print("[-] Invalid input for histogram equalizer" + '\n')
    exit()

# Auto Enhancement response
autoCounter = 1
if autoResponse == 1:
    autoCounter = 1
elif autoResponse == 0:
    autoCounter = 0
else:
    # print("[-] Invalid input for auto enhancement" + '\n')
    exit()

# ================
# Motion Detection
# ================
# Capture frames from modified (clipped) video
cap = cv2.VideoCapture(modified_video)
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
success, img1 = cap.read()
averageValue1 = np.float32(img1)

fps = 30
if video_time >= str("0:30:00"):
    fps = 80
elif video_time >= str("0:15:00"):
    fps = 40
else:
    fps = 20


# Basic background subtraction
def background_subtraction(imgBS_one, imgBS_two):
    imgDiff = cv2.absdiff(imgBS_one, imgBS_two)
    imgGray = cv2.cvtColor(imgDiff, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (5, 5), 0)
    _, imgThresh = cv2.threshold(imgBlur, 20, 255, cv2.THRESH_BINARY)
    imgDilated = cv2.dilate(imgThresh, None, iterations=3)
    imgContours_BS, _ = cv2.findContours(imgDilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    return imgContours_BS


while cap.isOpened():
    success, img2 = cap.read()
    if success is False:
        try:
            ImageHash.compare_images(path+"/Final 8.jpeg",path,removed)
            keyframes_lists = os.listdir(path)
        except:
            pass
        keyframes_lists = os.listdir(path)
        print("Images Captured: " + str(countOriginal) + '\n')
        #print("Images Filtered: " + str(countFinal) + '\n')
        print("Images Shortlisted: " + str(len(keyframes_lists)) + '\n')
        print("Background Subtraction results path: " + path + '\n')

        # print("[+] Background Subtraction Process finished!" + '\n')
        # Call mega detector function here

        image_file_names = ImagePathUtils.find_images(path,"store_true")
        load_and_run_detector(MEGA_MODEL_FILE_PATH,image_file_names,output,DEFAULT_RENDERING_CONFIDENCE_THRESHOLD,True)

        mega_keyframes_lists = os.listdir(output)

        print("Images Created: " + str(len(mega_keyframes_lists)) + '\n')
        print("Mega results path: " + output + '\n')

    # Skip frames function
    cf = cap.get(cv2.CAP_PROP_POS_FRAMES) - 1
    cap.set(cv2.CAP_PROP_POS_FRAMES, cf + fps)

    # Advance background subtraction
    cv2.accumulateWeighted(img2, averageValue1, 0.2)
    resultFrame1 = cv2.convertScaleAbs(averageValue1)
    imgContours = background_subtraction(img1, resultFrame1)

    for contour in imgContours:
        (x, y, w, h) = cv2.boundingRect(contour)
        if cv2.contourArea(contour) < 16000:
            continue
        cv2.rectangle(img1, (x, y), (x + w, y + h), (0, 255, 0), 2)
        imgCaptured = img1[y: y + h, x:x + w]
        countOriginal += 1

        # Save specific dimension of bbox only
        if imgCaptured.shape[1] >= 300 and imgCaptured.shape[0] >= 300:
            continue

        checkBlur = CheckBlurness.check_blur(imgCaptured, height)
        if checkBlur is not None:
            countSharpen += 1
        else:
            continue

        upScale = Enhancement.upscale_image(checkBlur, superCounter)
        if histCounter == 0 and autoCounter == 0:
            keyframes = CheckBlurness.checkBlur_final(upScale, height)
        elif histCounter == 1 and autoCounter == 0:
            equalize = Enhancement.histEqualize(upScale)
            keyframes = CheckBlurness.checkBlur_final(equalize, height)
        elif histCounter == 0 and autoCounter == 1:
            auto = Enhancement.enhance_brightness_and_contrast(upScale)
            keyframes = CheckBlurness.checkBlur_final(auto, height)
        elif histCounter == 1 and autoCounter == 1:
            equalize = Enhancement.histEqualize(upScale)
            auto = Enhancement.enhance_brightness_and_contrast(equalize)
            keyframes = CheckBlurness.checkBlur_final(auto, height)
        else:
            continue

        if keyframes is not None:
            cv2.imwrite(os.path.join(path, "Final " + str(countFinal) + ".jpeg"), keyframes,
                        [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            countFinal += 1
        else:
            continue

    # cv2.imshow("Output", img1)
    img1 = img2
    success, img2 = cap.read()
    # cv2.waitKey(1)

cv2.destroyAllWindows()
cap.release()
