import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultPokemonLimit')!;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findAllPaginated(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return await this.pokemonModel.find().limit(limit).skip(offset);
  }

  async findOne(term: string) {
    if (term) {
      if (isValidObjectId(term)) {
        const res = await this.pokemonModel.findById({ _id: term });
        return res;
      } else {
        const res = await this.pokemonModel.findOne({
          name: term,
        });
        if (!res) throw new BadRequestException('Pokemon not found');
        return res;
      }
    } else {
      throw new BadRequestException('Pokemon not found');
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.pokemonModel.findOne({ name: term }); // Query object to find the document
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById({ _id: term });
    }

    if (!pokemon) {
      throw new BadRequestException('Pokemon not found');
    }
    try {
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto, {
        new: true,
      });
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException('Pokemon not found');
    }
  }

  private handleExceptions(error: any) {
    console.error(error); // Log the error for debugging purposes
    if ((error as { code: number }).code === 11000) {
      throw new BadRequestException(
        `Pokemon with this name already exists ${JSON.stringify(
          (error as { keyValue: { name: string } }).keyValue,
        )}`,
      );
    } else {
      throw new InternalServerErrorException(
        'Failed to process the request - Check server logs',
      );
    }
  }
}
