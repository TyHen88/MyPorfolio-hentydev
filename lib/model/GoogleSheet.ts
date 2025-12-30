export interface GoogleSheetMedelRecord {
    id: string;
    contentName: string;
    contentTitle: string;
    contentDescription: string;
    contentImage: string;
    contentLink: string;
    contentTags: string[];
    contentDateStart: string;
    contentDateEnd: string;
    contentType: 'skill' | 'aboutMe' | 'project' | 'experience' | 'research' | 'learning' | 'blog' | 'education' | 'other';
    createAt: string;
    updateAt: string;
    status: boolean;
    contentSubtitle: string;

}

