import os from "os";
import ciInfo from "ci-info";
import { useProject } from "../../project.js";

type EnvironmentData = {
  systemPlatform: NodeJS.Platform;
  systemRelease: string;
  systemArchitecture: string;
  cpuCount: number;
  cpuModel: string | null;
  cpuSpeed: number | null;
  memoryInMb: number;
  isCI: boolean;
  ciName: string | null;
  sstVersion: string;
};

let data: EnvironmentData | undefined;

export function getEnvironmentData(): EnvironmentData {
  if (data) {
    return data;
  }

  const cpus = os.cpus() || [];
  const isSeed = !!process.env.SEED_APP_NAME;

  data = {
    // Software information
    systemPlatform: os.platform(),
    systemRelease: os.release(),
    systemArchitecture: os.arch(),
    // Machine information
    cpuCount: cpus.length,
    cpuModel: cpus.length ? cpus[0].model : null,
    cpuSpeed: cpus.length ? cpus[0].speed : null,
    memoryInMb: Math.trunc(os.totalmem() / Math.pow(1024, 2)),
    // Environment information
    isCI: ciInfo.isCI || isSeed,
    ciName: (isSeed ? "Seed" : ciInfo.name) || null,
    sstVersion: useProject().version,
  };

  return data;
}
