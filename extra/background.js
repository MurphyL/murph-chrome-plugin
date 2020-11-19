/**
 * 推荐清单
 */
const suggestConfig = {};

/**
 * 读取配置文件
 */
if(typeof(chrome.storage.local.get) === 'function') {
	chrome.storage.local.get([ 'savedConfig' ], ({ savedConfig }) => {
		if(!savedConfig) {
			return;
		}
		console.log('配置文件', JSON.parse(savedConfig));
		const { items, local } = JSON.parse(savedConfig);
		Object.assign(suggestConfig, { local });
		// 构造推荐数据
		(items || []).forEach(({ title, env }) => {
			for(let key in env) {
				if(!suggestConfig[key]) { 
					suggestConfig[key] = [];
				}
				if(typeof(env[key]) === 'object') {
					for(let item in env[key]) {
						let suffix = item ? '（' + item.toUpperCase() + '）' : '';
						suggestConfig[key].push({
							content: JSON.stringify({ env: key, url: env[key][item] }),
							description: `${title}${suffix} - ${key.toUpperCase()}环境`
						});
					}
				} else {
					suggestConfig[key].push({
						content: JSON.stringify({ env: key, url: env[key] }),
						description: `${title} - ${key.toUpperCase()}环境`
					});
				}
			}
		});
	});
}

chrome.omnibox.setDefaultSuggestion({
	description: '选择一个环境自动跳转'
});

/**
 * 推荐
 */
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	const suggestItems = suggestConfig[text.toLowerCase()];
	suggest(suggestItems ? suggestItems : suggestConfig.local);
});

/**
 * 跳转
 */
chrome.omnibox.onInputEntered.addListener((text) => {
	const { env, url } = JSON.parse(text);
	chrome.browserAction.setBadgeText({ 
		text: env ? env.toUpperCase() : ''
	});
	chrome.tabs.create({
		url,
		selected: true
	});
});
