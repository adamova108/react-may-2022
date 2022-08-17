import { Box, Skeleton } from "@mui/material"
import { useAuthConext } from "../../user/AuthContext"

export const SkeletonLoadingList = () => {
    const authContext = useAuthConext()
    console.log(authContext)
    return (
        <Box sx={{ width: 300 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
        </Box>
    )
}
