import {Children, isValidElement} from "react";

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
    children,
    ...allowedChildren
) => {
    let isAllowed = true;

    Children.map(children, (child) => {
        // allowedChildren 배열에 포함되어 있는지 확인
        if (!allowedChildren.includes(child?.type)) {
            isAllowed = false;
        }
    });

    return isAllowed;
};

export const validateChildCount = (children, constraints) => {
    const childTypeCountMap = {};

    Children.forEach(children, (child) => {
        // React.ReactElement 타입인 경우에만 처리
        if (isValidElement(child)) {
            const childType = child?.type?.name;
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