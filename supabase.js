const SUPABASE_URL = "https://dfomeijvzayyszisqflo.supabase.co";
const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmb21laWp2emF5eXN6aXNxZmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDg2NjA0MiwiZXhwIjoyMDYwNDQyMDQyfQ.K4VKm-nYlbODIEvO9P6vfKsvhLGQkY3Kgs-Fx36Ir-4"

function initSupabase() {
  if (!window.supabase || !window.supabase.from) {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return window.supabase;
}

const supabase = initSupabase();

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

async function createEmployeeAccount(employeeId, password) {
  try {
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

async function updateEmployeePassword(employeeId, password) {
  try {
    const emailEmployeeId = employeeId.toLowerCase();
    const email = `${emailEmployeeId}@example.com`;

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

async function deleteEmployeeAccount(employeeId) {
  try {
    const emailEmployeeId = employeeId.toLowerCase();
    const email = `${emailEmployeeId}@example.com`;

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

async function getAllSettingTableData() {
  try {
    const { data, error } = await supabase
      .from('allsettingtable')
      .select('카테고리순서, 카테고리, 업무구분, 아이콘, 연결주소')
      .order('카테고리순서');
    
    if (error) {
      console.error('allsettingtable 데이터 로드 에러:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('allsettingtable 데이터 로드 중 예외 발생:', error);
    return [];
  }
}

async function getEmployeeAccessPermissions(employeeId) {
  try {
    const { data, error } = await supabase
      .from('employees_approach')
      .select('*')
      .eq('직원번호', employeeId);
    
    if (error) {
      console.error('직원 접근 권한 로드 에러:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('직원 접근 권한 로드 중 예외 발생:', error);
    return [];
  }
}

async function saveEmployeeAccessPermissions(employeeId, permissions) {
  try {
    const { error: deleteError } = await supabase
      .from('employees_approach')
      .delete()
      .eq('직원번호', employeeId);
    
    if (deleteError) {
      console.error('기존 권한 삭제 실패:', deleteError);
      return { success: false, message: '기존 권한 삭제에 실패했습니다.' };
    }

    if (permissions.length > 0) {
      const formattedPermissions = permissions.map(permission => ({
        직원번호: permission.직원번호,
        카테고리순서: permission.카테고리순서,
        업무구분: permission.업무구분,
        연결주소: permission.연결주소
      }));
      
      const { error: insertError } = await supabase
        .from('employees_approach')
        .insert(formattedPermissions);
      
      if (insertError) {
        console.error('새 권한 추가 실패:', insertError);
        return { success: false, message: '새 권한 추가에 실패했습니다.' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('접근 권한 저장 중 예외 발생:', error);
    return { success: false, message: '접근 권한 저장 중 오류가 발생했습니다.' };
  }
}

async function updateEmployeeAccessPermissions(employeeId, permissions) {
  try {
    const { error: deleteError } = await supabase
      .from('employees_approach')
      .delete()
      .eq('직원번호', employeeId);
    
    if (deleteError) {
      console.error('기존 권한 삭제 실패:', deleteError);
      return { success: false, message: '기존 권한 삭제에 실패했습니다.' };
    }

    if (permissions.length > 0) {
      const formattedPermissions = permissions.map(permission => ({
        직원번호: permission.직원번호,
        카테고리순서: permission.카테고리순서,
        업무구분: permission.업무구분,
        연결주소: permission.연결주소
      }));
      
      const { error: insertError } = await supabase
        .from('employees_approach')
        .insert(formattedPermissions);
      
      if (insertError) {
        console.error('새 권한 추가 실패:', insertError);
        return { success: false, message: '새 권한 추가에 실패했습니다.' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('접근 권한 수정 중 예외 발생:', error);
    return { success: false, message: '접근 권한 수정 중 오류가 발생했습니다.' };
  }
}

async function deleteEmployeeAccessPermissions(employeeId) {
  try {
    const { error } = await supabase
      .from('employees_approach')
      .delete()
      .eq('직원번호', employeeId);
    
    if (error) {
      console.error('접근 권한 삭제 실패:', error);
      return { success: false, message: '접근 권한 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('접근 권한 삭제 중 예외 발생:', error);
    return { success: false, message: '접근 권한 삭제 중 오류가 발생했습니다.' };
  }
}