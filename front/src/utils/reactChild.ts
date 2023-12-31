import {Children, ReactElement, ComponentType} from "react";

import React, { ReactNode } from 'react';

/**
 * 주어진 children 타입이 허용된 ComponentType 인지 확인입니다.
 * @param children
 * @param allowedChildren
 *
 * @example
 * import {ModalHeader, ModalFooter}
 * isAllowedChildComponent(children, ModalHeader, ModalFooter)
 */
export const isAllowedChildComponent = (
    children: ReactNode,
    ...allowedChildren: ComponentType[]
): boolean => {
    let isAllowed = true;

    Children.map(children, (child) => {
        // allowedChildren 배열에 포함되어 있는지 확인
        if (!allowedChildren.includes(<React.ComponentClass<{}> | React.FunctionComponent<{}>>(child as ReactElement).type)) {
            isAllowed = false;
        }
    });

    return isAllowed;
};


type Constraints = Record<string, number>;

export const validateChildCount = (children: ReactNode, constraints: Constraints): void => {
    const childTypeCountMap: Record<string, number> = {};

    Children.forEach(children, (child) => {
        // React.ReactElement 타입인 경우에만 처리
        if (React.isValidElement(child as ReactElement)) {
            const childType = child.type.name as string; // 타입 단언을 통해 타입 추론
            childTypeCountMap[childType] = (childTypeCountMap[childType] || 0) + 1;
        }
    });


    Object.keys(constraints).forEach((childType) => {
        const expectedCount = constraints[childType];
        const actualCount = childTypeCountMap[childType] || 0;
        if (expectedCount !== actualCount) {
            throw new Error(`${childType} 컴포넌트는 ${expectedCount}개 이어야 합니다.(${actualCount}개)`);
        }
    });
};