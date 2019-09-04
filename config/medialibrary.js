module['exports'] = {

    /*
     * The disk on which to store added files and derived images by default. Choose
     * one or more of the disks you've configured in config/filesystems.php.
     */
    'disk_name': get_env('MEDIA_DISK', 'public'),

    /*
     * The maximum file size of an item in bytes.
     * Adding a larger file will result in an exception.
     */
    'max_file_size': 1024 * 1024 * 10,

    /*
     * The name of the media trait.
     */
    'media_model': 'media',

    'do': {
        /*
         * The domain that should be prepended when generating urls.
         */
        'domain': `https://${get_env('DO_BUCKET')}.sfo2.digitaloceanspaces.com`,
    },

    'remote': {
        /*
         * Any extra headers that should be included when uploading media to
         * a remote disk. Even though supported headers may vary between
         * different drivers, a sensible default has been provided.
         *
         * Supported by S3: CacheControl, Expires, StorageClass,
         * ServerSideEncryption, Metadata, ACL, ContentEncoding
         */
        'extra_headers': {
            'CacheControl': 'max-age=604800',
        }
    },

    'responsive_images': {

        /*
        * This class is responsible for calculating the target widths of the responsive
        * images. By default we optimize for filesize and create variations that each are 20%
        * smaller than the previous one. More info in the documentation.
        *
        * https://docs.spatie.be/laravel-medialibrary/v7/advanced-usage/generating-responsive-images
        */

        /*
         * The path where to store temporary files while performing image conversions.
         * If set to null, storage_path('medialibrary/temp') will be used.
         */
        'temporary_directory_path': null,
    }
}