import { IImage } from "../IImage";

export interface IHeroProps {
  spHttpClient: any;
  webUrl: string;
  listName: string;
  title: string;
  images: IImage[];
  fontFamily:string;
  fontColor?:string;
  textBackdrop: boolean;
}
