import dayjs, { Dayjs } from "dayjs";

export class Metadata {
    public readonly id: string;

    private readonly createdAt: Dayjs;
    private updatedAt: Dayjs | null = null;
    /**The id of the user that has created this resource */
    private readonly createdBy: string;
    /**The id of the user that last updated this resource */
    private updatedBy: string | null = null;

    constructor(
    ) {
        //TODO: For now do dates progromaticaly
        //TODO: Setup users
        this.id = crypto.randomUUID();
        this.createdAt = dayjs();
        this.createdBy = "Josh";
    }

    public getCreatedAt(): Dayjs {
        return this.createdAt;
    }

    public getLastUpdatedAt(): Dayjs {
        return this.updatedAt ?? this.createdAt;
    }

    public getCreatedBy(): string {
        return this.createdBy;
    }

    public getLastUpdatedBy(): string {
        return this.updatedBy ?? this.createdBy;
    }

    public update(): void {
        this.updatedBy = "Josh";
        this.updatedAt = dayjs();
    }
}
