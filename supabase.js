// Supabase API 키 및 URL 상수
const SUPABASE_URL = "https://dfomeijvzayyszisqflo.supabase.co";
const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmb21laWp2emF5eXN6aXNxZmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDg2NjA0MiwiZXhwIjoyMDYwNDQyMDQyfQ.K4VKm-nYlbODIEvO9P6vfKsvhLGQkY3Kgs-Fx36Ir-4"
//service rollkey사용해야함

function initSupabase() {
  // 이미 생성되어 있으면 재사용
  if (!window.supabase || !window.supabase.from) {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase 클라이언트가 새로 생성되었습니다.");
  } else {
    console.log("🔄 Supabase 클라이언트를 재사용합니다.");
  }
  return window.supabase;
}
// 사용하려는 위치에서 ↓ 이렇게 두 줄
const supabase = initSupabase(); // 1. 클라이언트 가져오기

// 직원 정보를 가져오는 함수
async function getEmployeesInfo() {
  try {
    const { data, error } = await supabase
      .from('employeesinfo')
      .select('직원번호, 직원명');
    
    if (error) {
      console.error('직원 정보 로드 에러:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('직원 정보 로드 중 예외 발생:', error);
    return [];
  }
}

// 직원 계정 추가 함수
async function createEmployeeAccount(employeeId, password) {
  try {
    // 입력된 직원번호를 소문자로 변환하여 이메일 생성
    const emailEmployeeId = employeeId.toLowerCase();
    const email = `${emailEmployeeId}@example.com`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      console.error('직원 계정 생성 실패:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('직원 계정 생성 중 예외 발생:', error);
    return { success: false, message: '직원 계정 생성 중 오류가 발생했습니다.' };
  }
}

// 직원 비밀번호 수정 함수
async function updateEmployeePassword(employeeId, password) {
  try {
    // 입력된 직원번호를 소문자로 변환하여 이메일 생성
    const emailEmployeeId = employeeId.toLowerCase();
    const email = `${emailEmployeeId}@example.com`;

    // 먼저 해당 유저 조회
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: '해당 직원 계정을 찾을 수 없습니다.' };
    }

    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password
    });

    if (error) {
      console.error('비밀번호 수정 실패:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('비밀번호 수정 중 예외 발생:', error);
    return { success: false, message: '비밀번호 수정 중 오류가 발생했습니다.' };
  }
}

// 직원 계정 삭제 함수
async function deleteEmployeeAccount(employeeId) {
  try {
    // 입력된 직원번호를 소문자로 변환하여 이메일 생성
    const emailEmployeeId = employeeId.toLowerCase();
    const email = `${emailEmployeeId}@example.com`;

    // 사용자 ID 조회
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: '해당 계정을 찾을 수 없습니다.' };
    }

    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.error('계정 삭제 실패:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('계정 삭제 중 예외 발생:', error);
    return { success: false, message: '계정 삭제 중 오류가 발생했습니다.' };
  }
}

