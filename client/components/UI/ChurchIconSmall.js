import Svg, { Path } from 'react-native-svg';
const ChurchIconSmall = props => (
    <Svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M6.87719 30H12.9123V24.3396C13.7544 20.3774 18.386 20.3774 19.0877 24.3396V30H25.1228V17.1226L16 9.48113L6.87719 17.1226V30Z"
            fill="white"
        />
        <Path
            d="M4.35088 17.5472L2.94737 15.8491L15.2982 5.51887V3.11321H13.0526V1.69811H15.2982V0H16.7018V1.69811H18.9474V3.11321H16.7018V5.51887L29.0526 15.7075L27.6491 17.5472L16 8.06604L4.35088 17.5472Z"
            fill="white"
        />
        <Path d="M0 30H5.89474V20.3774L0 23.7736V30Z" fill="white" />
        <Path
            d="M26.1053 20.3774V30H32V23.7736L26.1053 20.3774Z"
            fill="white"
        />
    </Svg>
);
export default ChurchIconSmall;
