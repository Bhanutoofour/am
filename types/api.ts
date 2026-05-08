// API Response Types
export interface ProductInIndustry {
  productId: number;
  productName: string;
}

export interface IndustryWithProducts {
  industryId: number;
  industryName: string;
  productsList: ProductInIndustry[];
}

export interface IndustriesWithProductsResponse {
  success: boolean;
  data: IndustryWithProducts[];
  count: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

// Products with Models API Types
export interface ModelData {
  modelName: string;
  modelTitle: string;
  brochure?: string;
}

export interface ProductWithModels {
  productId: number;
  productName: string;
  productThumbnail: string;
  productThumbnailAltText: string;
  modelsList: {
    attachments: ModelData[];
    equipments: ModelData[];
  };
}

export interface ProductsWithModelsResponse {
  success: boolean;
  data: ProductWithModels[];
  count: number;
}
