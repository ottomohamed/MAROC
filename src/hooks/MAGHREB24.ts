import { supabase } from '@/lib/supabase'
import { useState, useEffect, useRef } from "react";

//  ????? ???? ?? AI hooks  ???? ????????? ??? ?? ????? ????? 
type MAGHREB24NewsroomLog = { id: string; speakerName: string; message: string; createdAt: string; relatedArticleId?: string };
const useGetMAGHREB24Newsroom = (_?: any) => ({ data: [], isLoading: false, refetch: () => {} });
const useTriggerMAGHREB24Generation = () => ({ mutate: (_: any, __?: any) => {}, isPending: false });
const useMAGHREB24NewsroomDiscuss = () => ({ mutate: (_: any, __?: any) => {} });
const useListMAGHREB24Submissions = (_?: any) => ({ data: [], isLoading: false, refetch: () => {} });
const useApproveMAGHREB24Submission = () => ({ mutate: (_: any, __?: any) => {}, isPending: false });
const useRejectMAGHREB24Submission = () => ({ mutate: (_: any, __?: any) => {}, isPending: false });
const useAnalyzeMAGHREB24Trends = () => ({ mutate: (_: any) => {}, isPending: false });
const useGetMAGHREB24TrendsLatest = (_?: any) => ({ data: [] });
//  ????? ??????? ?????? 

