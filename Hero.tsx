import * as React from "react";
import { IHeroProps } from "./IHeroProps";
import { SPOService } from "../dataProviders/SPOService";
import styles from './Hero.module.scss';
import Image from './Image/Image';
import { IImage } from '../IImage';
import ImageCarousel from './ImageCarousel/ImageCarousel';
 
const Hero: React.FC<IHeroProps> = (props) => {
  const {spHttpClient, webUrl, listName, title, fontFamily, fontColor, textBackdrop} = props;
  const [images, setImages] = React.useState<IImage[]>([]);
  const [primaryImage, setPrimaryImage] = React.useState<IImage>(null);
  const [secondaryImages, setSecondaryImages] = React.useState<IImage[]>([]);

  const backgroundColor = textBackdrop ? 'rgb(0,0,0,0.4)' : 'unset';
 
  function formatImagesIntoRows(images: IImage[]): IImage[][] {
    return images.reduce((rows, key, index) => (
      index % 2 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)
    ) && rows, []);
  }

  

 
  const getImages = async (): Promise<void> => {
    const spoService:SPOService = new SPOService(spHttpClient, 'https://nwhdev.sharepoint.com/sites/FirstWebpart', 'Hero List');
    const images = await spoService.getListItems();
    console.log(images);
    
    const primaryImage = images[0];
    console.log(primaryImage);
 
    const secondaryImages = images.slice(1);
    console.log(primaryImage);
 
    setImages(images);
    setPrimaryImage(primaryImage);
    setSecondaryImages(secondaryImages);
  };
 
  const load = async (): Promise<void> => {
    await getImages();
  };
 
  React.useEffect(() => {
    load();
  }, []);
 
  return (
    <div className={styles.container}>
      { title && <h3 className={styles.title}>{title}</h3> }
      <div className={styles.hero}>
        { primaryImage &&
          <div className={styles.primaryContainer}>
            <div className={styles.imageContainer} onClick={() => { window.location.href = primaryImage.LinkURL }}>
              <Image item={primaryImage} fontFamily={fontFamily} fontColor={fontColor} backgroundColor={backgroundColor} />
            </div>
          </div>
        }
        { secondaryImages.length >= 1 &&
          <div className={styles.secondaryContainer} data-imgcount={secondaryImages.length}>
          {
          formatImagesIntoRows(secondaryImages).map((row: IImage[], idx: React.Key) => (
            <div className={styles.imageRow} key={idx}>
              {row.map((image: IImage, idx: React.Key) => (
                <div className={styles.imageContainer} key={idx} onClick={() => {window.location.href = image.LinkURL}}>
                  <Image item={image} fontFamily={fontFamily} fontColor={fontColor} backgroundColor={backgroundColor} />
                </div>
              ))}
            </div>
          ))
          }
          </div>
        }
      </div>
      { images.length > 0 &&
      <ImageCarousel images={images} fontFamily={fontFamily} fontColor={fontColor} backgroundColor={backgroundColor} />
      }
    </div>
  );
};
 
export default Hero;
