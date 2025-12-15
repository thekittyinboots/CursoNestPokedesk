import {
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNumber({ maxDecimalPlaces: 0, allowNaN: false })
  @Min(1, { message: 'The number must be at least 1' })
  @IsPositive({ message: 'The number must be positive' })
  no: number;
  @IsString({ message: 'Model must be a string' })
  @MinLength(2, { message: 'Model must be at least 2 characters long' })
  name: string;
}
