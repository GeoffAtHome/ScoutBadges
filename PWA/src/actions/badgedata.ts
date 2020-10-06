export interface Badge {
    id: string,
    title: string,
    image: string,
    imageType: string,
    info: string
}

export interface LawAndPromise {
    title: string,
    promise: string,
    law: string,
    motto: string
}

export interface BadgeLink {
    link: string,
    name: string,
    type: string
}

export interface SectionData {
    lawAndPromise: LawAndPromise,
    activity: Array<Badge>,
    challenge: Array<Badge>,
    core: Array<Badge>,
    staged: Array<Badge>
}

export type SectionDataType = "" | "lawAndPromise" | "activity" | "challenge" | "core" | "staged"

export interface BadgeData {
    Beavers: SectionData,
    Cubs: SectionData,
    Scouts: SectionData,
    Explorers: SectionData,
    Badges: Array<BadgeLink>

}

export type BadgeDataType = "" | "Beavers" | "Cubs" | "Scouts" | "Explorers" | "Badges"

export const defaultBadge = {
    id: "",
    title: "",
    image: "",
    imageType: "",
    info: ""
}
export const defaultBadgeArray: Array<Badge> = [defaultBadge]

export const defaultLawAndPromise: LawAndPromise = {
    title: "",
    promise: "",
    law: "",
    motto: ""
}

const defaultSection: SectionData =
{
    lawAndPromise: defaultLawAndPromise,
    activity: defaultBadgeArray,
    challenge: defaultBadgeArray,
    core: defaultBadgeArray,
    staged: defaultBadgeArray
}

export const defaultBadgeLink: Array<BadgeLink> =
    [{
        link: "",
        name: "",
        type: ""
    }]


export const defaultBadgeData: BadgeData =
{
    Beavers: defaultSection,
    Cubs: defaultSection,
    Scouts: defaultSection,
    Explorers: defaultSection,
    Badges: defaultBadgeLink
}
