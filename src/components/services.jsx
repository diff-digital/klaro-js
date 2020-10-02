import React from 'react';
import ServiceItem from './service-item';

export const ServiceItems = ({ services, consents, lang, toggle, t }) => {
    return services.map((service) => {
        const toggleService = (value) => {
            toggle([service], value);
        };
        const checked = consents[service.name];
        return (
            <li key={service.name} className="cm-service">
                <ServiceItem
                    checked={checked || service.required}
                    onToggle={toggleService}
                    lang={lang}
                    t={t}
                    {...service}
                />
            </li>
        );
    });
};

export default class Services extends React.Component {
    constructor(props) {
        super(props);
        props.manager.watch(this);
        this.state = {
            consents: props.manager.consents,
        };
    }

    componentWillUnmount() {
        this.props.manager.unwatch(this);
    }

    update(obj, type, data) {
        if (obj === this.props.manager && type === 'consents')
            this.setState({ consents: data });
    }

    render() {
        const { config, t, manager, lang } = this.props;
        const { consents } = this.state;
        const { services } = config;

        const toggle = (services, value) => {
            services.map((service) => {
                if (!service.required) {
                    manager.updateConsent(service.name, value);
                }
            });
        };

        const toggleAll = (value) => {
            toggle(services, value);
        };

        const serviceItems = (
            <ServiceItems lang={lang} services={services} t={t} consents={consents} toggle={toggle} />
        );

        const togglableServices = services.filter((service) => !service.required);

        const allDisabled =
            togglableServices.filter((service) => consents[service.name]).length === 0;

        const onlyRequiredEnabled =
            services.filter((service) => service.required).length > 0 && allDisabled;

        return (
            <ul className="cm-services">
                {serviceItems}
                {togglableServices.length > 1 && (
                    <li className="cm-service cm-toggle-all">
                        <ServiceItem
                            name="disableAll"
                            title={t(['service', 'disableAll', 'title'])}
                            description={t([
                                'service',
                                'disableAll',
                                'description',
                            ])}
                            checked={!allDisabled}
                            onlyRequiredEnabled={onlyRequiredEnabled}
                            onToggle={toggleAll}
                            lang={lang}
                            t={t}
                        />
                    </li>
                )}
            </ul>
        );
    }
}