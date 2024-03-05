import { Text } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { IImage } from '../IImage';
 
export class SPOService {
    private spHttpClient: SPHttpClient;
    private webUrl: string;
    private listName: string;
 
    constructor(spHttpClient: SPHttpClient, webUrl: string, listName: string) {
        this.spHttpClient = spHttpClient;
        this.webUrl = webUrl;
        this.listName = listName;
    }
 
    public async getListItems (): Promise<IImage[]> {
        let select: string = "ImageURL,LinkURL,Title,Active,SortOrder";
        // let filter: string = "Active eq 1";
        // let expand: string = "Consortium_x0020_Name";
 
        let endPoint = Text.format("{0}/_api/web/lists/getbytitle('{1}')/items?$select={2}", this.webUrl, this.listName, select);
        let images: IImage[];
        await this.getData(endPoint).then(data => {
            images = data.value
        });
        return images;
    }
 
    private getData(endPoint: string){
        return new Promise<any>((resolve, reject) => {
            this.spHttpClient.get(endPoint, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    if(response.status != 204)
                        resolve(response.json());
                }
                else {
                    console.log("response");
                    reject(response);
                }
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}
