import ThumbImage from "./ThumbImage/ThumbImage";
import classes from "./ThumbNail.module.scss";
import { useState } from "react";

import { buildUrl } from "cloudinary-build-url";

function ThumbNail(props) {
  return (
    <div className={classes["thumbnail"]}>
      {props.images.map((image, index) => {
        const url = buildUrl(image, {
          cloud: {
            cloudName: "bubblemarketplace",
          },
        });

        let isSelected = false;

        if (props.selectedImage === index) {
          isSelected = true;
        }

        return (
          <div
            key={index}
            className={`${classes["item-container"]} ${
              isSelected ? classes["selected"] : ""
            }  `}
            onMouseEnter={() => {
              props.setSelectedImage(index);
            }}
          >
            <div className={classes["item"]}>
              <ThumbImage url={url} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ThumbNail;
