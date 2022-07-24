import classes from "./AddImages.module.scss";


import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ImageUploading from "react-images-uploading";
import Image from "next/image";
function AddImages(props) {

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit

        props.onChange(imageList, props.color)
      };


  return (
    <div className="App">
      <ImageUploading
        multiple
        value={props.images}
        onChange={onChange}
        maxNumber={69}
        dataURLKey="data_url"
        
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className={classes["image-wrapper"]}>
            <button
              className={classes["image-dropper"]}
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Clicca o trascina qui
            </button>

            <div className={classes["photo-list-container"]}>
              {imageList.map((image, index) => (
                <div key={index} className={classes["list-item"]}>
                  <Image
                    src={image["data_url"]}
                    width={100}
                    height={100}
                    alt={"Phone photo"}
                  />

                  <span
                    className={classes["change-photo"]}
                    onClick={() => onImageUpdate(index)}
                  >
                    Cambia
                  </span>
                  <IconButton
                    aria-label="delete"
                    className={classes.delete}
                    onClick={() => onImageRemove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
            {imageList.length === 0 ? (
              <span className={classes.text}>Nessuna immagine caricata.</span>
            ) : (
              <button
                className={classes["remove-all-image"]}
                onClick={onImageRemoveAll}
              >
                Rimuovi tutte le immagini
              </button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default AddImages;
