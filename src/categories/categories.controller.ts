import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'The list of categories has been successfully retrieved.',
    type: [Category],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page || paginationDto.limit) {
      return this.categoriesService.findAllPaginated(paginationDto);
    }
    return this.categoriesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search categories by name' })
  @ApiResponse({
    status: 200,
    description: 'The list of categories has been successfully retrieved.',
    type: [Category],
  })
  search(@Query('name') name: string, @Query() paginationDto: PaginationDto) {
    return this.categoriesService.searchByName(name, paginationDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({
    status: 200,
    description:
      'The list of active categories has been successfully retrieved.',
    type: [Category],
  })
  findActive(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page || paginationDto.limit) {
      return this.categoriesService.findActivePaginated(paginationDto);
    }
    return this.categoriesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully retrieved.',
    type: Category,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: Category,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
    type: Category,
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
