interface PageInfoObjectType {
    page: number;
    loading: boolean;
    hasMore: boolean;
}

export interface PageInfoType {
    upcoming: PageInfoObjectType;
    past: PageInfoObjectType;
    freeze: PageInfoObjectType;
}

export default {}