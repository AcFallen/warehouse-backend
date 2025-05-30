import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseUtil } from '../common/utils/response.util';
import { ApiSuccessResponse } from '../common/interfaces/api-response.interface';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ApiSuccessResponse<Category>> {
    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name '${createCategoryDto.name}' already exists`,
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    return ResponseUtil.created(savedCategory, 'Category created successfully');
  }

  async findAll(): Promise<ApiSuccessResponse<Category[]>> {
    const categories = await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });

    return ResponseUtil.success(
      categories,
      `Found ${categories.length} categories`,
    );
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<ApiSuccessResponse<Category[]>> {
    const { skip } = paginationDto;
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    // Obtener total de registros y los datos paginados en paralelo
    const [categories, total] = await this.categoryRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    // Calcular información de paginación
    const pagination = ResponseUtil.calculatePagination(total, page, limit);

    return ResponseUtil.paginated(
      categories,
      pagination,
      `Found ${categories.length} categories (page ${page} of ${pagination.totalPages})`,
    );
  }

  async findOne(id: string): Promise<ApiSuccessResponse<Category>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return ResponseUtil.success(category, 'Category found successfully');
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiSuccessResponse<Category>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Si se está actualizando el nombre, verificar que no exista otra categoría con ese nombre
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with name '${updateCategoryDto.name}' already exists`,
        );
      }
    }

    // Actualizar la categoría
    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);

    return ResponseUtil.updated(
      updatedCategory,
      'Category updated successfully',
    );
  }

  async remove(id: string): Promise<ApiSuccessResponse<null>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    await this.categoryRepository.remove(category);

    return ResponseUtil.deleted('Category deleted successfully');
  }

  async findActive(): Promise<ApiSuccessResponse<Category[]>> {
    const activeCategories = await this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    return ResponseUtil.success(
      activeCategories,
      `Found ${activeCategories.length} active categories`,
    );
  }

  async findActivePaginated(
    paginationDto: PaginationDto,
  ): Promise<ApiSuccessResponse<Category[]>> {
    const { skip } = paginationDto;
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { isActive: true },
      order: { name: 'ASC' },
      skip: skip,
      take: limit,
    });

    const pagination = ResponseUtil.calculatePagination(total, page, limit);

    return ResponseUtil.paginated(
      categories,
      pagination,
      `Found ${categories.length} active categories (page ${page} of ${pagination.totalPages})`,
    );
  }

  async searchByName(
    name: string,
    paginationDto: PaginationDto,
  ): Promise<ApiSuccessResponse<Category[]>> {
    const { skip } = paginationDto;
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const [categories, total] = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name ILIKE :name', { name: `%${name}%` })
      .orderBy('category.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const pagination = ResponseUtil.calculatePagination(total, page, limit);

    return ResponseUtil.paginated(
      categories,
      pagination,
      `Found ${categories.length} categories matching "${name}"`,
    );
  }
}
