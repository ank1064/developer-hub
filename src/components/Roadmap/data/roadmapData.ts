import { MODULES } from "../../../constants";
import { CdData } from "./cdData";
import { CiData } from "./ciData";
import { FfData } from "./ffData";
import { FmeData } from "./fmeData";
import { CcmData } from "./ccmData";
import { StoData } from "./stoData";
import { SscaData } from "./sscaData";
import { CeData } from "./ceData";
import { IdpData } from "./idpData";
import { SeiData } from "./seiData";
import { IacmData } from "./iacmData";
import { platformData } from "./platformData";
import { aidaData } from "./aidaData";
import { codeData } from "./codeData";
import { CdeData } from "./cdeData"; 
import { DbdevopsData } from "./dbdevopsData"; 
import { AtaData } from "./ataData"; 


export interface ModuleData {
  title: string;
  description: string;
  module: string;
  horizon: Horizon;
}

export type tag = {
  color?: string;
  textColor?: string;
  value: string;
};

export type Feature = {
  tag?: tag[];
  title: string;
  description: string;
  link?: string;
  backgroundColor?: string;
};
export interface Horizon {
  [key: string]: {
    description: string;
    feature: Feature[];
  };
}

const ModuleData: ModuleData[] = [
  {
    title: "Platform",
    description:
      "SaaS release status: GA, SMP release status: GA",
    module: MODULES.platform,
    horizon: platformData,
  },
  {
    title: "Continuous Delivery & GitOps",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.cd,
    horizon: CdData,
  },
  {
    title: "Database DevOps",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.dbdevops,
    horizon: DbdevopsData,
  },
  {
    title: "AI Test Automation",
    description: "SaaS release status: GA, SMP release status: Not yet planned",
    module: MODULES.ata,
    horizon: AtaData,
  },
  {
    title: "Continuous Integration",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.ci,
    horizon: CiData,
  },
  {
    title: "Feature Flags",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.ff,
    horizon: FfData,
  },
  {
    title: "Feature Management & Experimentation",
    description: "SaaS release status: GA, SMP release status: Not yet planned",
    module: MODULES.fme,
    horizon: FmeData,
  },
  {
    title: "Cloud Cost Management",
    description: "SaaS release status: GA, SMP release status: Beta",
    module: MODULES.ccm,
    horizon: CcmData,
  },
  {
    title: "Security Testing Orchestration",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.sto,
    horizon: StoData,
  },
  {
    title: "Supply Chain Security",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.ssca,
    horizon: SscaData,
  },
  {
    title: "Chaos Engineering",
    description:
      "SaaS release status: GA, SMP release status: Limited GA",
    module: MODULES.ce,
    horizon: CeData,
  },
  {
    title: "Internal Developer Portal",
    description: "SaaS release status: GA, SMP release status: On Roadmap",
    module: MODULES.idp,
    horizon: IdpData,
  },
  {
    title: "Software Engineering Insights",
    description:
      "SaaS release status: GA, SMP release status: Not yet planned",
    module: MODULES.sei,
    horizon: SeiData,
  },
  {
    title: "Infrastructure as Code Management",
    description: "SaaS release status: GA, SMP release status: On Roadmap",
    module: MODULES.iacm,
    horizon: IacmData,
  },
 
  {
    title: "Code Repository",
    description: "SaaS release status: GA, SMP release status: GA",
    module: MODULES.code,
    horizon: codeData,
  },
  {
    title: "Harness AI",
    description: "SaaS release status: GA, SMP release status: Not yet planned",
    module: MODULES.aida,
    horizon: aidaData,
  },
  {
    title: "Cloud Development Environments",
    description: "SaaS release status: GA, SMP release status: On Roadmap",
    module: MODULES.cde,
    horizon: CdeData,
  },

];

export default ModuleData;
