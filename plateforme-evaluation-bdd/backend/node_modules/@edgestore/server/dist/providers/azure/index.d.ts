import { type Provider } from '@edgestore/shared';
/**
 * Options for the Azure provider. Compatible with Azure Blob Storage and Azurite.
 * Use Azure Storage Explorer for local development with Azurite.
 * @see https://azure.microsoft.com/de-de/products/storage/storage-explorer
 * @category Providers
 * @example
 *  AzureProvider({
 *      storageAccountName: 'devstoreaccount1',
 *      sasToken: 'some-generated-token-from-azure-storage-explorer',
 *      containerName: 'some-container-name',
 *      customBaseUrl: 'http://localhost:10000/devstoreaccount1',
 *  })
 */
export type AzureProviderOptions = {
    /**
     * The storage account name for Azure Blob Storage
     * Can also be set via the `ES_AZURE_ACCOUNT_NAME` environment variable.
     */
    storageAccountName?: string;
    /**
     * SAS token for Azure Blob Storage
     * Can also be set via the `ES_AZURE_SAS_TOKEN` environment variable.
     */
    sasToken?: string;
    /**
     * Azure Blob Storage container name
     * Can also be set via the `ES_AZURE_CONTAINER_NAME` environment variable.
     */
    containerName?: string;
    /**
     * Optional base URL for the Azure Blob Storage.
     * Useful for local development with Azurite. For example: `http://localhost:10000/devstoreaccount1`
     * Can also be set via the `ES_AZURE_BASE_URL` environment variable.
     */
    customBaseUrl?: string;
};
export declare function AzureProvider(options?: AzureProviderOptions): Provider;
//# sourceMappingURL=index.d.ts.map