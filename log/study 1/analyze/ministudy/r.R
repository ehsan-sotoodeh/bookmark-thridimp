require(ggplot2)
require(plyr)
require(reshape2)
require(reshape)
require(ez)
require(grid)
require(extrafont)
require(svglite)

taskdata.df <- read.table('slog-ct.txt', sep="\t", header=TRUE)
names(taskdata.df)

test<-sapply(taskdata.df,function(x)is.factor(x))
test
levelTest <- sapply(taskdata.df,function(x)length(levels(x)))
levelTest

ctsummary.df <- ddply(subset(taskdata.df,select=c("method","block","err")), .(method,block), summarize, mean = round(mean(err),2), sd = round(sd(err),2), se = round(sd(err)/sqrt(length(err)),2))
ctsummary.df


ct_anova <- ezANOVA(data=taskdata.df, dv=err, wid=subject, within=.(method),type=1, detailed=TRUE, return_aov=TRUE)
ct_anova

////////// Completion time


taskdata.df <- read.table('slog-ct.txt', sep="\t", header=TRUE)
names(taskdata.df)

test<-sapply(taskdata.df,function(x)is.factor(x))
test
levelTest <- sapply(taskdata.df,function(x)length(levels(x)))
levelTest

ctsummary.df <- ddply(subset(taskdata.df,select=c("method","block","ct")), .(method,block), summarize, mean = round(mean(ct),2), sd = round(sd(ct),2), se = round(sd(ct)/sqrt(length(ct)),2))
ctsummary.df


ct_anova <- ezANOVA(data=taskdata.df, dv=ct, wid=subject, within=.(method,block),type=1, detailed=TRUE, return_aov=TRUE)
ct_anova
