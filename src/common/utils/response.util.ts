import {
  ApiSuccessResponse,
  PaginationInfo,
} from '../interfaces/api-response.interface';

export class ResponseUtil {
  /**
   * Genera una respuesta exitosa
   */
  static success<T>(
    data: T,
    message?: string,
    pagination?: PaginationInfo,
  ): ApiSuccessResponse<T> {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    if (pagination) {
      response.pagination = pagination;
    }

    return response;
  }

  /**
   * Genera una respuesta exitosa con mensaje personalizado
   */
  static successWithMessage<T>(
    data: T,
    message: string,
  ): ApiSuccessResponse<T> {
    return this.success(data, message);
  }

  /**
   * Genera una respuesta exitosa para operaciones de creación
   */
  static created<T>(
    data: T,
    message = 'Resource created successfully',
  ): ApiSuccessResponse<T> {
    return this.success(data, message);
  }

  /**
   * Genera una respuesta exitosa para operaciones de actualización
   */
  static updated<T>(
    data: T,
    message = 'Resource updated successfully',
  ): ApiSuccessResponse<T> {
    return this.success(data, message);
  }

  /**
   * Genera una respuesta exitosa para operaciones de eliminación
   */
  static deleted(
    message = 'Resource deleted successfully',
  ): ApiSuccessResponse<null> {
    return this.success(null, message);
  }

  /**
   * Genera una respuesta exitosa con paginación
   */
  static paginated<T>(
    data: T[],
    pagination: PaginationInfo,
    message?: string,
  ): ApiSuccessResponse<T[]> {
    return this.success(data, message, pagination);
  }

  /**
   * Calcula información de paginación
   */
  static calculatePagination(
    total: number,
    page: number,
    limit: number,
  ): PaginationInfo {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
