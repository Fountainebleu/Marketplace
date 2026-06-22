import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { FILTER_CATEGORIES, formatProductCategory } from '@/types/productCategories';
import { ProductCategory } from '@/types/product';

export interface ICatalogFiltersState {
  query: string;
  category: ProductCategory | '';
  minPrice: string;
  maxPrice: string;
}

interface ICatalogFiltersProps {
  filters: ICatalogFiltersState;
  onChange: (filters: ICatalogFiltersState) => void;
  priceErrors?: Partial<Record<'minPrice' | 'maxPrice', string>>;
}

const hideNumberSpinnersSx = {
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
};

export const CatalogFilters = ({ filters, onChange, priceErrors = {} }: ICatalogFiltersProps) => {
  const set = (patch: Partial<ICatalogFiltersState>) => onChange({ ...filters, ...patch });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
        <TuneIcon fontSize="small" color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          Каталог
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        <TextField
          placeholder="Поиск товаров..."
          value={filters.query}
          onChange={(event) => set({ query: event.target.value })}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: filters.query ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Очистить поиск"
                  onClick={() => set({ query: '' })}
                  edge="end"
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip
            label="Все"
            clickable
            variant={filters.category === '' ? 'filled' : 'outlined'}
            color={filters.category === '' ? 'primary' : 'default'}
            onClick={() => set({ category: '' })}
          />
          {FILTER_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={formatProductCategory(cat)}
              clickable
              variant={filters.category === cat ? 'filled' : 'outlined'}
              color={filters.category === cat ? 'primary' : 'default'}
              onClick={() => set({ category: cat })}
            />
          ))}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              label="Категория"
              value={filters.category}
              onChange={(event) => set({ category: event.target.value as ProductCategory | '' })}
            >
              <MenuItem value="">Все</MenuItem>
              {FILTER_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {formatProductCategory(cat)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Цена от"
              type="number"
              value={filters.minPrice}
              onChange={(event) => set({ minPrice: event.target.value })}
              inputProps={{ min: 0 }}
              error={!!priceErrors.minPrice}
              helperText={priceErrors.minPrice}
              sx={{ width: 140, ...hideNumberSpinnersSx }}
            />
            <TextField
              label="Цена до"
              type="number"
              value={filters.maxPrice}
              onChange={(event) => set({ maxPrice: event.target.value })}
              inputProps={{ min: 0 }}
              error={!!priceErrors.maxPrice}
              helperText={priceErrors.maxPrice}
              sx={{ width: 140, ...hideNumberSpinnersSx }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};
