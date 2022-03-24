import { Field } from 'formik';
import { Flex, Box, chakra } from '@chakra-ui/react';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';

import '../../Register.scss';

export const StepsFormRoadmap = ({ name }: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          <Flex gap="20px" align="center">
            <Card
              title="Nivel Inicial"
              isActive={field.value === 1}
              onClick={() => form.setFieldValue(name, 1)}
              icon={<IconInicial isActive={field.value === 1} />}
              description="Si eres nuevo en el mundo del desarrollo y la programación esta hoja de ruta es para tí."
            />

            <Card
              title="Nivel Intermedio"
              isActive={field.value === 2}
              onClick={() => form.setFieldValue(name, 2)}
              icon={<IconIntermedio isActive={field.value === 2} />}
              description="Si has tenido una breve experiencia previa en el mundo del desarrollo elige esta opción."
            />

            <Card
              title="Nivel Avanzado"
              isActive={field.value === 3}
              onClick={() => form.setFieldValue(name, 3)}
              icon={<IconAvanzado isActive={field.value === 3} />}
              description="Si tienes experiencia y conoces Java, Javascript, HTML y CSS esta hoja de ruta es la ideal."
            />
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const Card = ({
  title,
  description,
  icon,
  isActive,
  onClick,
}: {
  title: string;
  description: string;
  icon: any;
  isActive: boolean;
  onClick: () => any;
}) => {
  return (
    <Flex
      direction="column"
      align="start"
      p="20px 24px"
      zIndex={1}
      cursor="pointer"
      transition="all 0.2s ease"
      onClick={onClick}
      gap="19px"
      rounded="13px"
      border="1px solid"
      borderColor={isActive ? 'primary' : 'gray_5'}
      _hover={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.22)', zIndex: 2, transform: 'translate(0px, -5px)' }}
    >
      {icon}

      <Flex direction="column" gap="12px">
        <Box fontSize="16px" fontWeight="bold">
          {title}
        </Box>

        <Box fontSize="13px" fontWeight="medium">
          {description}
        </Box>
      </Flex>
    </Flex>
  );
};

const IconInicial = ({ isActive }: { isActive: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.3276 21.7706V15.2208C14.847 15.1203 17.5779 14.666 19.4622 12.783C22.141 10.106 21.9312 5.71713 21.921 5.5316C21.891 4.98747 21.4562 4.55297 20.9116 4.52296C20.7261 4.51262 16.3339 4.30307 13.6551 6.97995C13.37 7.26477 13.118 7.56912 12.8947 7.88552C12.5022 6.30966 11.7647 4.54905 10.386 3.1714C7.18625 -0.0260112 1.92078 0.225383 1.6983 0.237785C1.15377 0.267793 0.718947 0.702297 0.688917 1.24643C0.676648 1.46888 0.424926 6.73048 3.62477 9.92796C5.96901 12.2705 9.42136 12.7618 11.1877 12.8522V21.7706C11.542 21.7308 11.8992 21.7103 12.2576 21.7103C12.6161 21.7103 12.9733 21.7309 13.3276 21.7706Z"
      fill={isActive ? 'primary' : 'gray_4'}
    />
  </svg>
);

const IconIntermedio = ({ isActive }: { isActive: boolean }) => (
  <chakra.svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_2243_10975)">
      <path
        d="M23.1211 15.7383H20.168V21.6445H17.2148V26.0742H27.6V9.83203H23.1211V15.7383Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path d="M2.40039 21.6445H15.7387V26.0742H2.40039V21.6445Z" fill={isActive ? 'primary' : 'gray_4'} />
      <path d="M5.35352 15.7383H18.6918V20.168H5.35352V15.7383Z" fill={isActive ? 'primary' : 'gray_4'} />
      <path d="M11.2598 3.92578H27.6004V8.35547H11.2598V3.92578Z" fill={isActive ? 'primary' : 'gray_4'} />
      <path d="M8.30664 9.83203H21.6449V14.2617H8.30664V9.83203Z" fill={isActive ? 'primary' : 'gray_4'} />
    </g>

    <defs>
      <clipPath id="clip0_2243_10975">
        <rect width="25.2" height="25.2" fill="white" transform="translate(2.40039 2.40039)" />
      </clipPath>
    </defs>
  </chakra.svg>
);
const IconAvanzado = ({ isActive }: { isActive: boolean }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_2243_10986)">
      <path
        d="M8.6043 9.01172L6.3483 9.18601C5.72055 9.23453 5.16146 9.56354 4.81429 10.0887L2.2125 14.0237C1.9492 14.4219 1.90735 14.9203 2.10046 15.3569C2.29362 15.7935 2.69057 16.0977 3.16229 16.1708L5.22793 16.4907C5.71114 13.9264 6.86788 11.3684 8.6043 9.01172Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M13.5098 24.7729L13.8297 26.8385C13.9028 27.3102 14.207 27.7072 14.6436 27.9003C14.8252 27.9806 15.0174 28.0203 15.2087 28.0203C15.4774 28.0203 15.7442 27.942 15.9768 27.7882L19.9119 25.1865C20.4371 24.8393 20.7661 24.2801 20.8145 23.6525L20.9888 21.3965C18.6321 23.133 16.0741 24.2897 13.5098 24.7729Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M12.7329 23.3412C12.8046 23.3412 12.8767 23.3353 12.9487 23.3233C14.023 23.1437 15.0585 22.8411 16.0463 22.445L7.55639 13.9551C7.16031 14.9428 6.85769 15.9783 6.67806 17.0527C6.60726 17.4762 6.74931 17.9076 7.05289 18.2113L11.7901 22.9485C12.0422 23.2005 12.3824 23.3412 12.7329 23.3412Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M25.9448 13.5256C28.0224 9.50907 28.0993 5.26459 27.9907 3.27397C27.9535 2.5919 27.4098 2.04811 26.7276 2.01093C26.4035 1.99323 26.0194 1.98047 25.5864 1.98047C23.3605 1.98047 19.8385 2.31761 16.476 4.05684C13.8038 5.43903 10.2997 8.48248 8.23242 12.4821C8.25683 12.5012 8.28069 12.5215 8.30317 12.5439L17.4578 21.6985C17.4803 21.721 17.5005 21.7448 17.5195 21.7692C21.5192 19.7019 24.5626 16.1978 25.9448 13.5256ZM17.1218 7.48544C18.609 5.99828 21.0289 5.99812 22.5162 7.48544C23.2366 8.20586 23.6334 9.16379 23.6334 10.1826C23.6334 11.2015 23.2366 12.1594 22.5162 12.8799C21.7727 13.6234 20.7957 13.9952 19.819 13.9953C18.8421 13.9953 17.8655 13.6236 17.1218 12.8799C16.4013 12.1594 16.0045 11.2015 16.0045 10.1826C16.0045 9.16379 16.4013 8.20586 17.1218 7.48544Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M18.1996 11.8004C19.092 12.6928 20.544 12.6928 21.4363 11.8004C21.8686 11.3681 22.1066 10.7934 22.1066 10.1821C22.1066 9.57075 21.8686 8.99604 21.4363 8.56379C20.9902 8.1176 20.4041 7.89453 19.818 7.89453C19.2319 7.89453 18.6458 8.1176 18.1997 8.56379C17.7674 8.99604 17.5293 9.57075 17.5293 10.1821C17.5293 10.7934 17.7674 11.3682 18.1996 11.8004Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M2.75901 23.4404C2.95426 23.4404 3.14951 23.3659 3.29842 23.2169L5.78916 20.7262C6.08709 20.4282 6.08709 19.9452 5.78916 19.6473C5.49128 19.3493 5.00821 19.3493 4.71028 19.6473L2.21954 22.138C1.92161 22.436 1.92161 22.919 2.21954 23.2169C2.36851 23.3659 2.56376 23.4404 2.75901 23.4404Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M8.07146 21.9285C7.77358 21.6306 7.29052 21.6306 6.99258 21.9285L2.20392 26.7172C1.90599 27.0151 1.90599 27.4981 2.20392 27.7961C2.35289 27.945 2.54814 28.0195 2.74338 28.0195C2.93863 28.0195 3.13388 27.945 3.2828 27.796L8.07141 23.0074C8.3694 22.7095 8.3694 22.2265 8.07146 21.9285Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
      <path
        d="M9.27468 24.2117L6.784 26.7025C6.48606 27.0004 6.48606 27.4834 6.784 27.7813C6.93296 27.9303 7.12821 28.0048 7.32341 28.0048C7.51861 28.0048 7.71391 27.9304 7.86283 27.7813L10.3536 25.2906C10.6515 24.9927 10.6515 24.5097 10.3536 24.2117C10.0557 23.9138 9.57262 23.9138 9.27468 24.2117Z"
        fill={isActive ? 'primary' : 'gray_4'}
      />
    </g>

    <defs>
      <clipPath id="clip0_2243_10986">
        <rect width="26.04" height="26.04" fill="white" transform="translate(1.98047 1.98047)" />
      </clipPath>
    </defs>
  </svg>
);
