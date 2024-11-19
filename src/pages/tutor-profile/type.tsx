export interface Ratting {
    students: number
    alloverAverage: string,
    student_reviews: Array<StudentReview>
    KnowledgeExpertise: RattingValues
    EngagementEnthusiasm: RattingValues
    ClarityUnderstandability: RattingValues
    PunctualityPreparedness: RattingValues
}

export interface StudentReview {
    student_name: string
    rate: string
    comments: string
    lessionType: string
    date: string
}

export interface RattingValues {
    average: number
    five: number
    four: number
    three: number
    two: number
    one: number
}