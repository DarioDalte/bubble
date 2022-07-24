import classes from "./MobileCarousel.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper";
import { buildUrl } from "cloudinary-build-url";
import Image from "next/image";

function MobileCarousel(props) {
  console.log(props.images);
  return (
    <>
      <Swiper
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className={classes["mySwiper"]}
      >
        {props.images.length != 0 &&
          props.images.map((image, index) => {
            return (
              <SwiperSlide key={index}>
                <Image
                  src={
                    props.images[0]
                      ? buildUrl(props.images[index], {
                          cloud: {
                            cloudName: "bubblemarketplace",
                          },
                        })
                      : "/temp"
                  }
                  alt={`Image of test`}
                  layout={"fill"}
                  objectFit={"contain"}
                  priority
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
}

export default MobileCarousel;
