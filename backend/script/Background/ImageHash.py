import imagehash
import os
import numpy as np
from PIL import Image
import shutil


def compare_images(location,path,new_path):
    # path = "Results"
    # new_path = "Removed"
    hash_size = 8
    similarity = 50
    fnames = os.listdir(path)
    threshold = 1 - similarity / 100
    diff_limit = int(threshold * (hash_size ** 2))

    with Image.open(location) as img:
        hash1 = imagehash.average_hash(img, hash_size).hash

    for image in fnames:
        with Image.open(os.path.join(path, image)) as img:
            hash2 = imagehash.average_hash(img, hash_size).hash

            if np.count_nonzero(hash1 != hash2) <= diff_limit:
                if np.all(hash1 == hash2):  # Prevent from comparing same images
                    continue
                # print("{} image found {}% similar to {}".format(image, similarity, location))
                src_path = path + "/" + image
                dst_path = new_path + "/" + image
                shutil.move(src_path, dst_path)