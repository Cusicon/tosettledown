module['exports'] = class Url {

    static temporaryUrl(url, time)
    {
        let app_url = config('app','url');
        return `${app_url}/${url}`;
    }
}