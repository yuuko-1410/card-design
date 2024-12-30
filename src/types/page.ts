export interface Page {
    id: string;
    title: string;
    config: Config;
    header_height: number;
    page_height: number;
    columns: Column[];
}

export interface Column {
    id: string;
    free_height: number;
    use_height: number;
    segments: Segment[];
}

export interface Segment {
    id: string;
    type: SegmentType;
    no: number;
    height: number;
    title: string;
    desc: null;
    score: number;
    is_paging: boolean;
    blocks: Block[];
    prev_nums: number;
    rows: number;
    lines: number;
}

export interface Block {
    id: string;
    qno: number;
    score: number;
    height: number;
    option_num: number;
    lines: number;
    prev_rows: number;
    rows: number;
}

export interface Config {
    is_red: boolean;
    is_bar_code: boolean;
    is_ab: boolean;
    number_digits: number;
    column_num: PageColumnType;
    precautions: string[];
}
export enum PageColumnType {
    A4_1 = 1,
    A3_2 = 2,
    A3_3 = 3,
}

export enum SegmentType {
    SingleBox = "single-box",
    Fill = "fill",
    AnswerTopic = "answer-topic",
    WritingCN = "writing-cn",
    WritingEN = "writing-en",
    OptionBox = "option-box",
    Ban = "ban",
}