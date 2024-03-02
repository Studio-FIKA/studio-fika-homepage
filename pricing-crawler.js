/**
 * Copy and paste this code to the browser console when you are on the
 * "Ajanvaraus" page of the website.
 *
 * You might need to open the inspector before running the code or the code
 * might not work.
 */

const sleep = async (time) => {
    await new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

const nodeListToArray = (list) => {
    return Array.prototype.slice.call(list);
};

const getCategories = () => {
    return nodeListToArray(document.querySelectorAll('.category-select'));
};

const clickElement = (element) => {
    element.click();
};

const parsePrice = (rawPrice) => {
    return Number.parseFloat(rawPrice.replace(',', '.'));
};

const formatPriceToEuro = (price) => {
    const isInteger = price % 1 === 0;

    const formattedPrice = price.toLocaleString('fi', {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol',
        minimumFractionDigits: isInteger ? 0 : 2,
        maximumFractionDigits: 2,
    });

    return formattedPrice.replace(/\s/g, '&nbsp;');
};

const returnFromCategory = () => {
    const backElement = document.querySelector(
        '.services-enter-done > .clickable.category-select'
    );

    clickElement(backElement);
};

const parsePricingInCategory = () => {
    const services = nodeListToArray(document.querySelectorAll('.accordion'));

    return services.map((service) => {
        const title = service.querySelector('.font-weight-bold').innerText;
        const price = service.querySelector(
            '.font-weight-bold.text-right'
        ).innerText;

        return {
            title,
            price,
        };
    });
};

const formatRawPricingInfo = (rawPricingInfo) => {
    return rawPricingInfo.map((pricingInfo) => {
        return {
            ...pricingInfo,
            price: formatPriceToEuro(parsePrice(pricingInfo.price)),
        };
    });
};

const formatPricingInfoToMarkdown = (pricingInfo) => {
    return pricingInfo.reduce((acc, data) => {
        const title = `## ${data.category}`;

        const tableHeader = '| Palvelu | Hinta |\n|:----|----:|';

        const pricingTableData = data.pricing.map(
            (service) => `| ${service.title} | ${service.price} |`
        );

        return `${acc}\n\n<section>\n\n${title}\n\n${tableHeader}\n${pricingTableData.join(
            '\n'
        )}\n\n</section>`;
    }, '');
};

const crawlPricing = async () => {
    const totalCategories = getCategories().length;

    let currentCategoryIndex = 0;

    const rawPricingInfoPerCategory = [];

    while (currentCategoryIndex < totalCategories) {
        const categories = getCategories();

        clickElement(categories[currentCategoryIndex]);

        await sleep(1000);

        rawPricingInfoPerCategory.push({
            category: categories[currentCategoryIndex].innerText,
            pricing: parsePricingInCategory(),
        });

        returnFromCategory();

        currentCategoryIndex++;
    }

    const formattedPricingInfo = rawPricingInfoPerCategory.map(
        (categoryPricingInfo) => {
            return {
                category: categoryPricingInfo.category,
                pricing: formatRawPricingInfo(categoryPricingInfo.pricing),
            };
        }
    );

    const markdownPricingInfo =
        formatPricingInfoToMarkdown(formattedPricingInfo);

    console.log(markdownPricingInfo);
};

crawlPricing();
