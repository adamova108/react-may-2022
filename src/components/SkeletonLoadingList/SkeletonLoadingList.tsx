import { Box, Skeleton } from "@mui/material"

export const SkeletonLoadingList = () => {
    return (
        <Box sx={{ width: 300 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
        </Box>
    )
}
