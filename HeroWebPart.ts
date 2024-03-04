import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IPropertyPanePage,
  PropertyPaneLabel,
} from '@microsoft/sp-property-pane';

import { PropertyFieldMessage } from '@pnp/spfx-property-controls/lib/PropertyFieldMessage';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

import * as strings from 'HeroWebPartStrings';
import Hero from './components/Hero';
import { IHeroProps } from './components/IHeroProps';
import { IImage } from './IImage';

export interface IHeroWebPartProps {
  // pass on Sp
  title: string;
  images: IImage[];
  fontFamily:string;
  fontColor?:string;
  textBackdrop: boolean;
}

export default class HeroWebPart extends BaseClientSideWebPart<IHeroWebPartProps> {
  public async onInit(): Promise<void> {
    this.properties.images = this.properties.images || [];
    return await super.onInit();
  }
  
  public render(): void {
      const element: React.ReactElement<IHeroProps> = React.createElement(
        Hero,
        {
          fontFamily: this.properties.fontFamily,
          fontColor: this.properties.fontColor,
          textBackdrop: this.properties.textBackdrop,
          ...this.properties,
        }
      );
      ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: '',
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: 'Slide Settings',
              isCollapsed: false,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                }),
                PropertyFieldCollectionData('images', {
                  key: 'images',
                  label: 'Images',
                  panelHeader: 'Image Collection',
                  manageBtnLabel: 'Manage Images',
                  panelDescription: 'Note: Limited to five images',
                  value: this.properties.images.slice(0, 5), // Limits the uploads to five images
                  fields: [
                    {
                      id: 'imageUrl',
                      title: 'Image URL',
                      type: CustomCollectionFieldType.url,
                      required: true,
                    },
                    {
                      id: 'linkUrl',
                      title: 'Link URL',
                      type: CustomCollectionFieldType.url,
                      required: true,
                    },
                    {
                      id: 'title',
                      title: 'Title',
                      type: CustomCollectionFieldType.string,
                      required: true,
                    },
                  ]
                }),
              ],
            },
            {
              groupName: 'Internal Comm. Settings',
              isCollapsed: true,
              groupFields: [
                PropertyFieldMessage("", {
                  key: "MessageKey",
                  text: "Requires Internal Comm. approval",
                  messageType: MessageBarType.warning,
                  isVisible: true
                }),
                PropertyPaneDropdown('fontFamily', {
                  label: 'Select the type of font:',
                  options: [
                    { key: 'MFT Perfected', text: 'MFT Perfected' },
                    { key: 'Galaxie Polaris Condensed Bold', text: 'Galaxie Polaris Condensed Bold' },
                    { key: 'Galaxie Polaris Book', text: 'Galaxie Polaris Book' },
                    { key: 'Galaxie Polaris Bold', text: 'Galaxie Polaris Bold' },
                    { key: 'Galaxie Polaris Bold Italic', text: 'Galaxie Polaris Bold Italic' },
                    { key: 'Galaxie Polaris Medium', text: 'Galaxie Polaris Medium' },
                    { key: 'Galaxie Polaris Medium Italic', text: 'Galaxie Polaris Medium Italic' },
                    { key: 'Galaxie Polaris Book Italic', text: 'Galaxie Polaris Book Italic' },
                    { key: 'Arial', text: 'Arial' },
                    { key: 'Segoe UI', text: 'Segoe UI' },
                    { key: 'Roboto', text: 'Roboto' }
                  ]
                }),
                PropertyPaneTextField('fontColor', {
                  label: 'Enter font color (ex:white, black, blue, navy)'
                }),
                PropertyPaneToggle('textBackdrop', {
                  label: 'Add backdrop behind title text?',
                  checked: this.properties.textBackdrop
                })
              ],
            }
          ],
        },
      ],
    };
  }
}
