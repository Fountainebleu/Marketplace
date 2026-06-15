import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { CATEGORY_LABELS, FILTER_CATEGORIES } from '@/constants/categories';
import { ProductCategory } from '@/types/product';

export interface CatalogFiltersState {
  query: string;
  category: ProductCategory | '';
  minPrice: string;
  maxPrice: string;
}

interface CatalogFiltersProps {
  filters: CatalogFiltersState;
  onChange: (filters: CatalogFiltersState) => void;
}

export function CatalogFilters({ filters, onChange }: CatalogFiltersProps) {
  const set = (patch: Partial<CatalogFiltersState>) => onChange({ ...filters, ...patch });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
        <TuneIcon fontSize="small" color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          Поиск и фильтры
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        <TextField
          placeholder="Название, описание или артикул..."
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
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
              label={CATEGORY_LABELS[cat]}
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
              onChange={(e) => set({ category: e.target.value as ProductCategory | '' })}
            >
              <MenuItem value="">Все</MenuItem>
              {FILTER_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Цена от"
              type="number"
              value={filters.minPrice}
              onChange={(e) => set({ minPrice: e.target.value })}
              inputProps={{ min: 0 }}
              sx={{ width: 140 }}
            />
            <TextField
              label="Цена до"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => set({ maxPrice: e.target.value })}
              inputProps={{ min: 0 }}
              sx={{ width: 140 }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
