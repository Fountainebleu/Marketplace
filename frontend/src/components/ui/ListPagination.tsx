import { Pagination, Stack, Typography } from '@mui/material';

interface ListPaginationProps {
  page: number;
  pageCount: number;
  totalCount?: number;
  onChange: (page: number) => void;
}

export function ListPagination({ page, pageCount, totalCount, onChange }: ListPaginationProps) {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ mt: 3 }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, value) => onChange(value)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
      <Typography variant="body2" color="text.secondary">
        Страница {page} из {pageCount}
        {totalCount !== undefined && ` · всего ${totalCount}`}
      </Typography>
    </Stack>
  );
}
