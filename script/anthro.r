my_paths <- .libPaths()
my_paths <- c(my_paths, "./libs/R")
.libPaths(my_paths)

library(anthro)
library(jsonlite)

anthro <- function(sex, age, weight, height) {
    out <- toJSON(anthro_zscores(
        sex = sex,
        age = age,
        is_age_in_month = TRUE,
        weight = weight,
        lenhei = height
    ))
    return(out)
}