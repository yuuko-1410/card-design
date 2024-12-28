interface BlockType {
	type: BlockTypeEnum;
	label: string;
	index: string;
	scores: number[],
	qnos: number[];
}

enum BlockTypeEnum {
	// 身份区
	BCODE = "BCODE", // 条形码
	REGISTRATION_NUMBER = "RN", // 准考证填涂
	REGISTRATION_NUMBER_HANDWRITTEN = "RN_HAND", // 手写准考证
	MISSED_EXAM = "MISSED", // 缺考标记
	VERSION = "VERSION", // 答题卡AB卷区域

	// 题块儿
	MULTIPLE_CHOICE = "CQ", // 选择题
	FILLING_IN_BLANKS = "FILL", // 填空题
	SHORT_ANSWER = "SQ", // 主观题
	OPTIONAL_QUESTION = "OPTION", // 选做题
}

export { BlockTypeEnum };
export type { BlockType };
