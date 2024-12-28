interface LayoutStore {
    config: LayoutConfig;
    pages: LayoutPage[];
}
interface LayoutConfig {
    title: string;
    paperSpec: "A3" | "A4";
    column: 1 | 2 | 3;
    precautions: string[];//注意事项
    isIdentityCode: boolean;//是否采用身份码
    isMutalVersion: boolean;//是否采用多版本
    numberColNum: number;//考号列数
    isRed: boolean;//是否采用红色
    realHeight: number; // 信息区域的真实高度
}
interface LayoutPage {
    pageNum: number;
    colums: LayoutColumn[];
}
interface LayoutColumn {
    pageNum: number;
    columNum: number;
    elements: LayoutElement[];
}
interface LayoutElement {
    id: string;
    // 题块儿类型: 选择判断、填空题、简答题、作文中、作文英、选做题、非作答区域
    type: string | "single-box" | "fill" | "answer-topic" | "writing-cn" | "writing-en" | "option-box" | "ban";
    no: number; // 大题题目序号
    startQno: number; // 小题起始题号
    number: number; // 小题题目数量
    title?: string; // 大题题目，不写代表续接上页
    realHeight: number; // 题块儿的真实高度
    height?: number; // 题块儿的高度
    heights?: number[];// 每个qno的高度

    // 特殊字段类型
    score?: number; // 题块儿的分数【选做题/作文】
    scores?: number[];
    lineSizes?: number[]; // 填空题每个空的长度
    optionsNums?: number[]; // 单选/多选/判断题选项数量
    optionType?: string | "single" | "multiple" | "judge"
    maxWordNum?: number;// 中文作文的最大字数
    startWords?: number;// 中文作文开始的字数
    actualWordNum?: number;// 由于需要保证一行占满，中文作文的实际字数
    maxLine?: number;// 英文作文的最大行数
    // todo: 题目的图片
}

export type {
    LayoutStore,
    LayoutConfig,
    LayoutPage,
    LayoutColumn,
    LayoutElement
}