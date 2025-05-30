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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page || paginationDto.limit) {
      return this.categoriesService.findAllPaginated(paginationDto);
    }
    return this.categoriesService.findAll();
  }

  @Get('search')
  search(@Query('name') name: string, @Query() paginationDto: PaginationDto) {
    return this.categoriesService.searchByName(name, paginationDto);
  }

  @Get('active')
  findActive(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page || paginationDto.limit) {
      return this.categoriesService.findActivePaginated(paginationDto);
    }
    return this.categoriesService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
