import type Space from "@/application/domain/model/space";

export type SaveSpacePort = (space: Space) => Promise<void>;
