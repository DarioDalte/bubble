import Image from 'next/image'


function ThumbImage(props) {
  
  return (
    <Image
    // src={`/${loadedProduct.prodotto.image}`}
    src={props.url}
    alt={`test image`}
    layout={"fill"}
    objectFit={'contain'}
  
    priority
  />
  )
}

export default ThumbImage