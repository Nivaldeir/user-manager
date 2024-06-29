import "./infra/api";
import { CasesFactory } from "./core/application/factory/cases-factory";
import Registry from "./infra/di/registry";

const registry = Registry.getInstance()
registry.provide('factory_usecases', CasesFactory.create())



