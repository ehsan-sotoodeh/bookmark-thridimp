#========================================
# R scripts for anova
#========================================

require(ggplot2)
require(plyr)
require(reshape2)
require(reshape)
require(ez)
require(grid)
require(extrafont)
require(svglite)

#========================================
# load data
#========================================
ctData.df <- read.table('data_all2.txt', sep="\t", header=TRUE)
names(ctData.df)

# check factors and levels
factorTest<-sapply(ctData.df,function(x)is.factor(x))
factorTest

levelTest <- sapply(ctData.df,function(x)length(levels(x)))
levelTest

#========================================
# calculate summary stats - 
#========================================

ctSummary.df <- ddply(subset(ctData.df,select=c("cond","phase","blk", "ct")), .(cond,phase,blk), summarize, mean = round(mean(ct),2), sd = round(sd(ct),2), se = round(sd(ct)/sqrt(length(ct)),2))
ctSummary.df

ctSummary.df <- ddply(subset(ctData.df,select=c("cond","phase","blk", "ct")), .(cond,blk), summarize, mean = round(mean(ct),2), sd = round(sd(ct),2), se = round(sd(ct)/sqrt(length(ct)),2))
ctSummary.df


ctSummary.df <- ddply(subset(ctData.df,select=c("cond","phase","blk", "err")), .(cond,phase), summarize, mean = round(mean(err),2), sd = round(sd(err),2), se = round(sd(err)/sqrt(length(err)),2))
ctSummary.df

ctSummary.df <- ddply(subset(ctData.df,select=c("cond","phase","blk", "err")), .(cond,blk), summarize, mean = round(mean(err),2), sd = round(sd(err),2), se = round(sd(err)/sqrt(length(err)),2))
ctSummary.df






ctSumErr.df <- ddply(subset(ctData.df,select=c("phase","blk", "err", "cat2")), .(cat2), summarize, mean = round(mean(err),2), sd = round(sd(err),2), se = round(sd(err)/sqrt(length(err)),2))
ctSumErr.df

# Completion Time
library(ez)
library(lsr)

ct_anova <- ezANOVA(data=ctData.df, dv=ct, wid=ID, within=.(cond,phase,blk), type = 1, detailed=TRUE)
ct_anova

ct_anova <- ezANOVA(data=ctData.df, dv=err, wid=ID, within=.(cond,phase,blk), type = 1, detailed=TRUE)
ct_anova

ct_anovaErr <- ezANOVA(data=ctData.df, dv=err, wid=ID, within=.(cat2), type = 1, detailed=TRUE)
ct_anovaErr

pairwise.t.test(ctData.df$ct, ctData.df$cond, p.adj = "bonf")

pairwise.t.test(ctData.df$err, ctData.df$cond, p.adj = "bonf")


#===================================
# Distance
#===================================

fdisSummary.df <- ddply(subset(ctData.df,select=c("cond","blk","tri", "firstDis")), .(cond,blk), summarize, mean = round(mean(firstDis),2), sd = round(sd(firstDis),2), se = round(sd(firstDis)/sqrt(length(firstDis)),2))
fdisSummary.df

adisSummary.df <- ddply(subset(ctData.df,select=c("cond","blk","tri", "avgDis")), .(cond,blk), summarize, mean = round(mean(avgDis),2), sd = round(sd(avgDis),2), se = round(sd(avgDis)/sqrt(length(avgDis)),2))
adisSummary.df


fdis_anova <- ezANOVA(data=ctData.df, dv=firstDis, wid=id, within=.(cond,blk), detailed=TRUE)
fdis_anova

adis_anova <- ezANOVA(data=ctData.df, dv=avgDis, wid=id, within=.(cond,blk), detailed=TRUE)
adis_anova

pairwise.t.test(ctData.df$avgDis, ctData.df$cond, p.adj = "bonf")


#===================================
# Time Out
#===================================

toSummary.df <- ddply(subset(ctData.df,select=c("cond","blk","tri", "TO")), .(cond,blk), summarize, mean = round(mean(TO),2), sd = round(sd(TO),2), se = round(sd(TO)/sqrt(length(TO)),2))
toSummary.df

to_anova <- ezANOVA(data=ctData.df, dv=TO, wid=id, within=.(cond,blk), detailed=TRUE)
to_anova

pairwise.t.test(ctData.df$TO, ctData.df$cond, p.adj = "bonf")

#===================================
# No. of Scrolling
#===================================

srSummary.df <- ddply(subset(ctData.df,select=c("cond","blk","tri", "SR")), .(cond), summarize, mean = round(mean(SR),2), sd = round(sd(SR),2), se = round(sd(SR)/sqrt(length(SR)),2))
srSummary.df

sr_anova <- ezANOVA(data=ctData.df, dv=SR, wid=id, within=.(cond,blk), detailed=TRUE)
sr_anova

pairwise.t.test(ctData.df$SR, ctData.df$cond, p.adj = "bonf")

#===================================
# No. of Dragging
#===================================

drSummary.df <- ddply(subset(ctData.df,select=c("cond","blk","tri", "DR")), .(cond,blk), summarize, mean = round(mean(DR),2), sd = round(sd(DR),2), se = round(sd(DR)/sqrt(length(DR)),2))
drSummary.df

dr_anova <- ezANOVA(data=ctData.df, dv=DR, wid=id, within=.(cond,blk), detailed=TRUE)
dr_anova

pairwise.t.test(ctData.df$DR, ctData.df$cond, p.adj = "bonf")