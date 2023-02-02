

import {ApiPlugin, PluginExecutionProps} from "@superblocksteam/shared-backend";
import {
  ActionConfiguration,
  DatasourceConfiguration,
  DatasourceMetadataDto,
  ExecutionOutput, HttpMethod
} from "@superblocksteam/shared";
import {OpenAiDatasourceConfiguration} from "@superblocksteam/shared";
import {AxiosRequestConfig} from "axios";





export default class OpenAiPlugin extends ApiPlugin {
  dynamicProperties(): Array<string> {
    return [];
  }

  execute(executionProps: PluginExecutionProps<OpenAiDatasourceConfiguration>): Promise<ExecutionOutput | undefined> {
    const openAiResponse = this.getCompletion(executionProps.datasourceConfiguration);
    const executionOutput = new ExecutionOutput();
    executionOutput.output = openAiResponse;
    return Promise.resolve(executionOutput);
  }

  async getCompletion(datasourceConfiguration: OpenAiDatasourceConfiguration): Promise<ExecutionOutput> {
    const data = {
      'model' : datasourceConfiguration.aiModel,
      'prompt' : datasourceConfiguration.textPrompt,
      'temperature' : 0.7, // TODO
      'max_tokens' : datasourceConfiguration.maxTokensToUse,
      'top_p' : 1, // TODO
    }

    const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${datasourceConfiguration.bearerToken}`
    };

    const axiosRequestConfig: AxiosRequestConfig = {
      url: 'https://api.openai.com/v1/completions',
      method: 'POST',
      data: data,
      headers: headers,
      timeout: 100000  // TODO
    };
    return super.executeRequest(axiosRequestConfig);
}

  metadata(datasourceConfiguration: DatasourceConfiguration, actionConfiguration?: ActionConfiguration): Promise<DatasourceMetadataDto> {
    return Promise.resolve({});
  }

  test(datasourceConfiguration: DatasourceConfiguration): Promise<void> {
    return Promise.resolve(undefined);
  }



}
