import React from "react";
import classes from "./Carousel.module.scss";
import CarouselTemplate from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
function Carousel(props) {
  
  return (
    <CarouselTemplate
      arrows
      centerMode={false}
      containerClass={classes.container}
      draggable
      focusOnSelect={false}
      autoPlaySpeed={999999}
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={true}
      renderDotsOutside={false}
      itemClass={classes.item}
      removeArrowOnDeviceType={["mobile"]}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1600,
          },
          items: 4,
          slidesToSlide: 6
        },
        miniDesktop: {
          breakpoint: {
            max: 1600,
            min: 1024,
          },
          items: 4,
          slidesToSlide: 4
        },
        miniTablet: {
          breakpoint: {
            max: 760,
            min: 570,
          },
          items: 3,
          slidesToSlide: 3
        },
        mobile: {
          breakpoint: {
            max: 570,
            min: 0,
          },
          items: 2,
          slidesToSlide: 2
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 760,
          },
          items: 4,
          slidesToSlide: 4
        },
      }}
     
      swipeable
    >
      {props.children}
    </CarouselTemplate>
  );
}

export default Carousel;
