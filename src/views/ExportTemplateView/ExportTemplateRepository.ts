import { AxiosResponse } from 'axios';
import { API_EXPORT_TEMPLATE_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { ExportTemplate } from 'models/ExportTemplate';
import { ExportTemplateFilter } from 'models/ExportTemplateFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class ExportTemplateRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_EXPORT_TEMPLATE_ROUTE));
  }

  public count = (brandFilter?: ExportTemplateFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), brandFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    brandFilter?: ExportTemplateFilter,
  ): Promise<ExportTemplate[]> => {
    return this.http
      .post<ExportTemplate[]>(kebabCase(nameof(this.list)), brandFilter)
      .then((response: AxiosResponse<ExportTemplate[]>) => {
        return response.data?.map((brand: PureModelData<ExportTemplate>) =>
          ExportTemplate.clone<ExportTemplate>(brand),
        );
      });
  };

  public getExample = (id: number | string): Promise<ExportTemplate> => {
    return this.http
      .post<ExportTemplate>(kebabCase(nameof(this.getExample)), { id })
      .then((response: AxiosResponse<ExportTemplate>) =>
        ExportTemplate.clone<ExportTemplate>(response.data),
      );
  };

  public get = (id: number | string): Promise<ExportTemplate> => {
    return this.http
      .post<ExportTemplate>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ExportTemplate>) =>
        ExportTemplate.clone<ExportTemplate>(response.data),
      );
  };

  // public update = (brand: ExportTemplate): Promise<ExportTemplate> => {
  //   return this.http
  //     .post<ExportTemplate>(kebabCase(nameof(this.update)), brand)
  //     .then((response: AxiosResponse<ExportTemplate>) =>
  //       ExportTemplate.clone<ExportTemplate>(response.data),
  //     );
  // };

  public update = (
    file: File,
    filter?: ExportTemplateFilter,
    name: string = nameof(file),
  ): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    formData.append(`exportTemplateId`, `${filter.id.equal}`);
    return this.http
      .post<void>(kebabCase(nameof(this.update)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };
}

export const exportTemplateRepository: ExportTemplate = new ExportTemplateRepository();
