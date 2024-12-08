<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/VietTranDai/HCMUT_SSPS_Server.git">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo" width="160" height="160">
    <img src="hcmut.png" alt="HCMUT Logo" width="160" height="160">
    
  </a>

  <h3 align="center">Student Smart Printing Service Server</h3>

  <p align="center">
    Ứng dụng cung cấp dịch vụ in ấn tiện lợi cho sinh viên
    <br />
    <a href="#getting-started"><strong>Xem hướng dẫn »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#about-the-project">Về dự án này</a>
      <ul>
        <li><a href="#built-with">Công nghệ sử dụng</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu</a>
      <ul>
        <li><a href="#prerequisites">Điều kiện</a></li>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Hướng dẫn sử dụng</a>
      <ul>
        <li><a href="#notes">Một số lưu ý</a></li>
        <li><a href="#functions">Thao tác trong ứng dụng</a></li>
        <li><a href="#errors">Lỗi có thể xảy ra khi sử dụng</a></li>
      </ul>
    </li>
    <li><a href="#contact">Liên hệ</a></li>
    <li><a href="#acknowledgments">Tài liệu tham khảo</a></li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->

<a id="about-the-project"></a>

## Về dự án này

SSPS (Student Smart Printing Service) sẽ đáp ứng nhu cầu ngày càng tăng về các giải pháp in ấn hiệu quả, tiện lợi và đáng tin cậy trong khuôn viên trường. Dịch vụ này sử dụng công nghệ để đơn giản hóa quy trình in, cho phép sinh viên in tài liệu từ nhiều thiết bị khác nhau với thời gian chờ đợi tối thiểu. Sinh viên thường xuyên cần in bài tập, báo cáo nghiên cứu và các tài liệu khác, nhưng dịch vụ in truyền thống có thể chậm chạp hoặc bất tiện, đặc biệt là trong các kỳ thi hoặc khi lượng nhu cầu tăng cao. SSPS có thể tối ưu hóa quá trình này, mang đến sự linh hoạt, khả năng kiểm soát tốt hơn đối với các tác vụ in và giảm thiểu sai sót trong việc in ấn, đồng thời người dùng có thể truy cập lưu trữ lịch sử sử dụng dịch vụ.
Với sự phát triển của hệ thống Dịch vụ In thông minh cho Sinh viên (HCMUT_SSPS), trường Đại học Bách Khoa hy vọng sẽ nâng cao hiệu quả quản lý giáo dục, tối ưu hóa quy trình học thuật, và cung cấp một nền tảng hỗ trợ chất lượng cao cho sinh viên và giáo viên của mình. Đây sẽ là một bước tiến quan trọng giúp trường mở rộng quy mô hoạt động giáo dục và tăng cường vị thế cạnh tranh trong lĩnh vực giáo dục đại học.

Thành viên phát triển dự án:

- Trần Đại Việt - phát triển Backend
- Lương Thanh Tùng - phát triển Backend
- Trần Ngọc Châu Long - phát triển Frontend
- Trần Trung Kiên - phát triển Frontend
- Trần Quang Huy - phát triển Frontend
- Lê Đăng Khoa - phát triển Backend

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Công nghệ sử dụng

<a id="built-with"></a>

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Swagger](https://swagger.io/)
- [MySQL](https://www.mysql.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

<a id="getting-started"></a>

## Bắt đầu

<a id="prequite">

### Điều kiện

Trước khi sử dụng ứng dụng, bạn cần cài đặt các phần mềm sau:

1. **Node.js và npm**:

   - Tải xuống và cài đặt Node.js từ [Node.js Official Website](https://nodejs.org/). Quá trình cài đặt Node.js sẽ tự động cài đặt cả npm (Node Package Manager).
   - Kiểm tra cài đặt bằng các lệnh sau:
     ```bash
     node -v
     npm -v
     ```
     Đảm bảo rằng phiên bản Node.js và npm đã được cài đặt.

2. **MySQL**:

   - Tải và cài đặt MySQL từ [MySQL Official Website](https://dev.mysql.com/downloads/installer/). Chọn **MySQL Community** và cài đặt **MySQL Server** và **MySQL Workbench** để quản lý cơ sở dữ liệu.
   - Sau khi cài đặt, mở **MySQL Workbench** để tạo cơ sở dữ liệu và quản lý kết nối.

3. **MySQL Workbench**:
   - Đây là công cụ GUI giúp quản lý cơ sở dữ liệu MySQL. Sau khi cài đặt MySQL, **MySQL Workbench** cũng sẽ được cài đặt.
   - Đăng nhập và cấu hình kết nối đến cơ sở dữ liệu MySQL của bạn.

### Cài đặt

Bạn có thể sử dụng ứng dụng thông qua localhost bằng các bước sau:

1. **Lấy mã nguồn từ GitHub**:

   - Truy cập GitHub và tải source code của dự án về bằng cách clone repository:
     ```bash
     git clone <GitHub-Repository-URL>
     ```
   - Thay đổi thư mục làm việc thành thư mục dự án của bạn:
     ```bash
     cd <project-folder>
     ```

2. **Cài đặt thư viện npm**:

   - Tại thư mục gốc của dự án, chạy lệnh sau để cài đặt các thư viện cần thiết:
     ```bash
     npm install
     ```

3. **Cấu hình kết nối cơ sở dữ liệu MySQL**:

   - Mở file `.env` tại thư mục gốc của dự án (như trong ảnh bạn cung cấp), và thay đổi dòng `DATABASE_URL` với thông tin kết nối MySQL của bạn:
     ```bash
     DATABASE_URL="mysql://<username>:<password>@localhost:3306/<database_name>"
     ```
   - Thay `<username>` bằng tên tài khoản MySQL của bạn.
   - Thay `<password>` bằng mật khẩu MySQL của bạn.
   - Thay `<database_name>` bằng tên cơ sở dữ liệu mà bạn muốn sử dụng.

4. **Khởi tạo cơ sở dữ liệu với Prisma**:

   - Sau khi đã cấu hình thông tin kết nối trong file `.env`, chạy các lệnh sau để khởi tạo cơ sở dữ liệu với **Prisma**:
     ```bash
     npx prisma migrate dev
     npx prisma generate
     ```
   - Các lệnh này sẽ tạo và thiết lập các bảng trong cơ sở dữ liệu theo các migration đã định nghĩa.

5. **Khởi động server NestJS**:

   - Chạy lệnh sau để khởi động server của dự án:
     ```bash
     npm run start:dev
     ```
   - Server sẽ khởi động ở chế độ phát triển và lắng nghe ở cổng mà bạn đã chỉ định (ví dụ: cổng `8080` như trong file `.env` của bạn).

6. **Sử dụng Prisma Studio để quản lý cơ sở dữ liệu**:

   - Mở **Prisma Studio** để quản lý dữ liệu trong cơ sở dữ liệu:
     ```bash
     npx prisma studio
     ```
     **Prisma Studio** là công cụ GUI để tương tác trực tiếp với dữ liệu trong cơ sở dữ liệu mà không cần dùng lệnh SQL.

7. **Truy cập tài liệu API với Swagger**:
   - Khi server đã khởi động thành công, bạn có thể truy cập tài liệu API của dự án tại địa chỉ:
     ```bash
     http://localhost:8080/api
     ```
   - Đây là trang Swagger API Documentation, nơi bạn có thể xem và thử nghiệm các API của dự án.

---

### Lưu ý:

- Đảm bảo rằng các thông tin kết nối cơ sở dữ liệu trong file `.env` là chính xác trước khi khởi động server.
- Bạn cũng có thể cần kiểm tra phiên bản Node.js và MySQL để đảm bảo tương thích với các thư viện mà dự án sử dụng.

<!-- USAGE -->

<a id="usage"></a>

## Hướng dẫn sử dụng

Dưới đây là một số lệnh cơ bản để tương tác với NestJS và Prisma trong dự án:

### NestJS Commands

- **Chạy ứng dụng NestJS:**

  ```bash
    npm run start:dev
  ```

  Lệnh này sẽ khởi chạy ứng dụng NestJS. Bạn có thể truy cập ứng dụng qua đường dẫn [http://localhost:8080](http://localhost:8080).

- **Tạo module mới:**

  ```bash
    nest generate module <tên_module>
  ```

  Dùng để tạo module mới trong dự án.

- **Tạo controller mới:**

  ```bash
    nest generate controller <tên_controller>
  ```

  Lệnh này giúp tạo một controller mới để xử lý các yêu cầu HTTP.

- **Tạo service mới:**

  ```bash
   nest generate service <tên_service>
  ```

  Dùng để tạo một service mới để xử lý logic trong ứng dụng.

- **Tải những thư viện mới :**
  Chú ý phải tìm chính xác phiên bản của thư viện đó có thể lấy bản mới nhất.
  Sau khi xác định được phiên bản của thư viên muốn tải, ví dụ bạn muốn tải thư viện **@types/react**, hãy lên trình duyệt tìm kiếm **npm @types/react** để xác định phiên bản mới nhất.
  Dùng câu lệnh

  ```bash
    npm install --save-exact <Tên thư viện>@<phiên_bản>
  ```

  Ví dụ:

  ```bash
    npm install --save-exact @types/react@18.3.11
  ```

### Prisma Commands

- **Khởi tạo Prisma:**

  ```bash
   npx prisma init
  ```

  Dùng để khởi tạo thư mục `prisma/` và file cấu hình `schema.prisma`.

- **Migrate database:**

  ```bash
   npx prisma migrate dev --name tên_migration
  ```

  Lệnh này chạy migration cho database, giúp đồng bộ hóa các thay đổi schema với cơ sở dữ liệu thực tế.

- **Tạo Prisma client:**

  ```bash
   npx prisma generate
  ```

  Tạo ra Prisma Client để tương tác với cơ sở dữ liệu trong mã nguồn.

- **Chạy Prisma Studio:**

  ```bash
   npx prisma studio
  ```

  Prisma Studio là một giao diện trực quan để xem và quản lý dữ liệu trong cơ sở dữ liệu.

### Tham khảo thêm

Để biết thêm chi tiết, bạn có thể tham khảo tài liệu chính thức của:

- NestJS: https://docs.nestjs.com/
- Prisma: https://www.prisma.io/docs

<p align="right">(<a href="#readme-top">back to top</a>)</p>

**Lưu ý**: vì ứng dụng vẫn đang trong giai đoạn phát triển nên một số chức năng sẽ không được đầy đủ như mong muốn

<!-- CONTACT -->

<a id="contact"></a>

## Tài liệu Liên Quan

Dưới đây là danh sách các tài liệu quan trọng liên quan đến dự án:

#### 1. Mô Tả Và Phân Tích Các Yêu Cầu Của hệ thống

- Mô tả chi tiết về hệ thống HCMUT_SSPS, các tính năng, và mục tiêu của dịch vụ in thông minh dành cho sinh viên.
- Các yêu cầu chức năng và phi chức năng của hệ thống, bao gồm các tính năng cần có cho từng đối tượng sử dụng trong dự án.
- Xem tài liệu chi tiết tại đây: [project_description.pdf](docs/project_description.pdf)

#### 2. Sơ Đồ Use-Case

- Sơ đồ use-case của hệ thống HCMUT_SSPS, mô tả các chức năng chính mà người dùng có thể tương tác.
- Xem tài liệu chi tiết tại đây: [use_case_diagram.pdf](docs/use_case_diagram.pdf)

#### 3. Kiến Trúc Hệ Thống

- Mô tả kiến trúc của hệ thống HCMUT_SSPS, bao gồm các lớp và chiến lược triển khai giao diện người dùng, lưu trữ dữ liệu, và kết nối với các API bên ngoài.
- Xem tài liệu chi tiết tại đây: [system_architecture.pdf](docs/system_architecture.pdf)

#### 4. System Modelling

- Mô tả quy trình kinh doanh giữa các hệ thống và người dùng trong một mô-đun cụ thể của hệ thống qua các Activity Diagram.
- Mô hình dãy thời gian mô tả tương tác giữa các đối tượng trong hệ thống, được sử dụng trong các tình huống cụ thể, được mô tả qua các Sequence Diagram.
- Component Diagram, mô tả các lớp đối tượng trong mô-đun, các thuộc tính và phương thức của chúng.
- Xem tài liệu chi tiết tại đây: [system_modelling.pdf](docs/system_modelling.pdf)

#### 5. Giao Diện Người Dùng - MVP 1

- Giao diện người dùng mẫu cho phiên bản MVP 1, bao gồm các màn hình cơ bản của hệ thống in thông minh cho sinh viên.
- Xem tài liệu chi tiết tại đây: [mvp1_wireframe.pdf](docs/mvp1_wireframe.pdf)

#### 6. Báo Cáo Kiểm Thử Usability

- Báo cáo kiểm thử tính khả dụng (usability test) của giao diện người dùng MVP 1, bao gồm các bước và kết quả thu thập từ người dùng thử nghiệm.
- Xem tài liệu chi tiết tại đây: [usability_test_report.pdf](docs/usability_test_report.pdf)

#### 7. Giao Diện Người Dùng - MVP 2

- Giao diện người dùng mẫu cho phiên bản MVP 2.
- Xem tài liệu chi tiết tại đây: [mvp2_wireframe.pdf](docs/mvp2_wireframe.pdf)

#### 8. Báo cáo hoàn thiện hệ thống và demo kết quả thực hiện

- Lấy đường dẫn slide và báo cáo dự án tại đây: [final_present.pdf](docs/final_present.pdf)

#### 9. Hướng Dẫn Sử Dụng API

- Xem chi tiết về cách sử dụng API của hệ thống HCMUT_SSPS, bao gồm các endpoint và cách tương tác với hệ thống, bằng cách chạy server ở local sau đó vào đường dẫn [http://localhost:8080/api](http://localhost:8080/api) để xem Api document do Swagger tích hợp cung cấp.

#### 10. Hướng Dẫn Cài Đặt Git, Github Và Áp Dụng GitFlow vào dự án

- Hướng dẫn chi tiết về cách thiết lập hệ thống kiểm soát phiên bản sử dụng Git và Github cho dự án.
- Xem tài liệu chi tiết tại đây: [git-flow.md](docs/git-flow//git-flow.md)

## Liên hệ

Mọi thắc mắc, báo lỗi, đề xuất tính năng cho ứng dụng xin hay liên hệ qua địa chỉ email: viet.trankhmtbk22@hcmut.edu.vn

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

<a id="acknowledgments"></a>

## Tài liệu tham khảo

1. Sommerville, I. (2016). Software Engineering 10th Edition. Boston: Pearson Education Limited.

2. [How to install MySQL on Windows 10/11 [ 2024 Update ] MySQL Server & MySQL Workbench Complete guide](https://www.youtube.com/watch?v=BxdSUGBs0gM)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
